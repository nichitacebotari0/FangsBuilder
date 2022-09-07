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


# Create the jsons for each augment
function New-AugmentJson() {
    param (
        $directory
    )
    $i = 1;
    Write-Host $directory.FullName;
    $directory | Get-ChildItem -File -Filter *.png | Sort-Object Name | ForEach-Object {
        $i++;
        $id = ([System.Math]::Floor($i / 2)).ToString();
        Write-Host $_.FullName
        if ("ULT" -eq $directory.Name -and 8 -eq $i) {
            $name = "icon.png"
            Rename-Item -Path $_.FullName -NewName $name
        }
        elseif ($i % 2 -eq 0) {
            $name = $id + "_icon.png";
            Rename-Item -Path $_.FullName -NewName $name
        }
        else {
            $name = $id + "_z.png"
            Rename-Item -Path $_.FullName -NewName $name
            # The OCR module must be run in windows powershell so im launching the powershell i got in path which is ver 5
            $x = powershell -OutputFormat Text -Command "& {
            Import-Module -Name C:\Users\Nichita\Documents\PowerShell\Modules\PsOcr
            Get-Item $(Join-Path $directory $($id + "_z.png")) | Convert-PsoImageToText | Select-Object Text | ForEach-Object { `$_.Text } 
            }"
            $properties = [ordered]@{
                Id          = $id;
                Name        = $x[0];
                IconName    = $id + "_icon.png";
                Description = @();
            }
            $desc = $x | Select-Object -Skip 1 
            if ($desc[0].Contains("[")) {
                $desc = $desc | Select-Object -Skip 1 
            }
            $properties.Description += $desc
            return $properties # prevents overwrite, maybe should keep description text in a separate file and build it up into this json but  I see no value in it atm. inb4 i curse myself later
        }
    }
}

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
                        Contents = @()
                    }
                    $augmentCategory.Contents += (New-AugmentJson $category)
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
                        Augments = @()
                    }
                    $skillAugment.Augments += New-AugmentJson $subCategory
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