# Copy the template folders in each hero augment category
$heroes = Get-ChildItem .\Heroes\
foreach ($hero in $heroes) {
    $augmentCategories = $hero | Get-ChildItem  | Where-Object -FilterScript { $_.Name -ne "ULT" }
    foreach ($augmentCategory in $augmentCategories) {
        foreach ($templateFolder in Get-ChildItem .\template\) {
            Copy-Item -Path $templateFolder.FullName -Destination $($hero.FullName + "\" + $augmentCategory.Name + "\" + $templateFolder.Name) 
        }
    } 
}

# Auto rename images to avoid a small bit of hassle and manual errors
function RenameFolderImages() {
    param (
        [Parameter(
            Mandatory = $true, 
            ValueFromPipeline = $true,
            ValueFromPipelineByPropertyName = $true)]
        $directory
    )
    process {
        $i = 2;
        Write-Host $directory.FullName
        $directory | Get-ChildItem -exclude *_icon.png, *_z.png | ForEach-Object {
            Write-Host $_.FullName
            if ("ULT" -eq $directory.Name -and 8 -eq $i) {
                Rename-Item -Path $_.FullName -NewName "icon.png"
                continue;
            }

            if ($i % 2 -eq 0) {
                $name = ([System.Math]::Floor($i / 2)).ToString() + "__icon.png";
            }
            else {
                $name = ([System.Math]::Floor($i / 2)).ToString() + "_z.png"
            }
            Rename-Item -Path $_.FullName -NewName $($name)
            $i++;
        }
    }
}

function AutoRenameHeroImages($directory) {
    $directory | Get-ChildItem -Directory -Recurse | Where-Object { $_ | Get-ChildItem -File -Filter *.png | Select-Object -First 1 } | AutoRenameImages 
}


# OCR cus im tired of writing by hand after 4 heroes
Find-Module -Name PsOcr | Install-Module -Scope CurrentUser
# Must be run in windows powershell so im launching the powershell i got in path which is ver 5
powershell
Import-Module -Name C:\Users\Nichita\Documents\PowerShell\Modules\PsOcr 
Get-ChildItem -File -Filter *_z.png -Recurse | Convert-PsoImageToText | Select-Object Text | foreach {$_.Text}| ConvertTo-Json | Set-Clipboard 


# Create the jsons for each augment
function New-AugmentJson() {
    param (
        $directory
    )
    Write-Host $directory;
    $directory | Get-ChildItem -File -Filter *_icon.png | ForEach-Object {
        $iconNameSplit = $($_.Name -split "_")
        $properties = [ordered]@{
            Id          = $iconNameSplit[0];
            Name        = $($iconNameSplit[1]);
            IconName    = $_.Name;
            Description = @("");
        }
        return $properties # prevents overwrite, maybe should keep description text in a separate file and build it up into this json but  I see no value in it atm. inb4 i curse myself later
    }
}

function Get-AugmentDirectories {
    param (
        $directory
    )
    return $directory | Get-ChildItem -Directory -Recurse | Where-Object { $_ | Get-ChildItem -File -Filter *_icon.png | Select-Object -First 1 }
}

#single hero
Get-AugmentDirectories -directory (Get-Location)| ForEach-Object { New-AugmentJson -directory $_.FullName }
# root folder
Get-AugmentDirectories -directory $(Join-Path (Get-Location)  '\Heroes\') | ForEach-Object { New-AugmentJson -directory $_.FullName }


# script to add the iconpath argument that i forgot to add, facepalm. added iconpath to the new-augmentjson script above so this is largely unnecessary now 
function Patch-AugmentJson() {
    param (
        $directory
    )
    Write-Host $directory;
    $directory | Get-ChildItem -File -Filter *_icon.png | ForEach-Object {
        $iconNameSplit = $($_ -split "_")
        $fileName = $($iconNameSplit[0] + ".json")
        $filePath = Join-Path $directory $fileName
       
        $o = ConvertFrom-Json (Get-Item $filePath | Get-Content -Raw )
        $o | Add-Member -NotePropertyName IconName  -NotePropertyValue $_.Name
        $json = ConvertTo-Json $o 
        
        $json | Out-File -FilePath $filePath 
    }
}
Get-HeroAugmentDirectories -directory $(Get-Location) | ForEach-Object { Patch-AugmentJson $_.FullName }



# Create a json for the hero and compile the hero's augments jsons into it

function Get-HeroJson() {
    param (
        [Parameter(
            Position = 0, 
            Mandatory = $true, 
            ValueFromPipeline = $true,
            ValueFromPipelineByPropertyName = $true)]
        [String]$directory
    )
    process {
        $allAugs = $directory | Get-ChildItem -Directory | ForEach-Object {
            foreach ($category in $_) {
                if ($category.Name -eq "ULT") {
                    $augmentCategory = [ordered]@{
                        Type     = $category.Name;
                        Contents = ,(New-AugmentJson $category)
                    }
                    $augmentCategory
                    continue;
                }
            
                $augmentCategory = [ordered]@{
                    Type     = $category.Name;
                    Contents = @()
                }
                foreach ($subCategory in ($category | Get-ChildItem -Directory)) {
                    $subCategoryNameSplit = $($subCategory.Name.Split("."))
                    $skillAugment = [ordered]@{
                        Id       = $subCategoryNameSplit[0]; 
                        Name     = $subCategoryNameSplit[1];
                        Augments = ,(New-AugmentJson $subCategory)
                    }
                    $augmentCategory["Contents"] += $skillAugment
                }
                $augmentCategory
            }
        }
        $heroIcon = $directory | Get-ChildItem -File -Filter icon.png | Select-Object -First 1
        $locationPathSplit = (($directory).Split('\'))
        $result = [ordered]@{
            Id       = -1;
            Name     = $locationPathSplit[$locationPathSplit.Count - 1] 
            IconName = $heroIcon.Name;
            Augments = @()
        }
        $result["Augments"] = $allAugs
        $result
    }
}

#single hero 
Get-Location | Get-HeroJson | ConvertTo-Json -Depth 10 |  Out-File 'HeroInfo.json'
#all heroes
Get-ChildItem -directory $(Join-Path (Get-Location)  '\Heroes\') | ForEach-Object {
    $_ | Get-HeroJson | ConvertTo-Json -Depth 10 |  Out-File (Join-Path $_ 'HeroInfo.json')
}
    

# Make a json linking to every hero json, yeah something feels a bit wrong. Ill refactor if im still working on this at least a week
$array = $(Join-Path (Get-Location)  '\Heroes\') | Get-ChildItem -Directory | ForEach-Object { $_.Name }
$array | ConvertTo-Json |  Out-File (Join-Path (Get-Location)  '\Heroes\Info.json' )

# am I violatinvg DRY by canibalizing script above? Yes. Does it matter? No
function Get-PositionalsJson() {
    param (
        $directory
    )
    
    $locationPathSplit = (($directory).Path.Split('\'))   
    $augmentCategory = @{
        Type     = $locationPathSplit[$locationPathSplit.Count - 1];
        Contents = @()
    }
    foreach ($subCategory in ($directory | Get-ChildItem -Directory)) {
        $subCategoryNameSplit = $($subCategory.Name.Split("."))
        $skillAugment = @{
            Id       = $subCategoryNameSplit[0]; 
            Name     = $subCategoryNameSplit[1];
            Augments = GetAugments($subCategory);
        }
        $augmentCategory["Contents"] += $skillAugment
    }
    $augmentCategory
}

Get-PositionalsJson -directory (Get-Location) | ConvertTo-Json -Depth 5  | Out-File Info.json


# The actives at last
GetAugments(Get-Location) | ConvertTo-Json | Out-File Info.json