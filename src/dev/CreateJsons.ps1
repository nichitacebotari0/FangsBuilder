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


# Create the txts for each augment
function New-AugmentJson() {
    param (
        $directory
    )
    Write-Host $directory;
    $directory | Get-ChildItem -File -Filter *_icon.png | ForEach-Object {
        $iconNameSplit = $($_ -split "_")
        $properties = @{
            Id          = $iconNameSplit[0];
            Name        = $($iconNameSplit[1]);
            Description = @("");
            IconName    = $_.Name;
        }
        $o = New-Object psobject -Property $properties;
        $json = ConvertTo-Json $o 
        
        $fileName = $($iconNameSplit[0] + ".json")
        $filePath = Join-Path $directory $fileName
        $json | Out-File -FilePath $filePath -NoClobber # prevents overwrite, maybe should keep description text in a separate file and build it up into this json but  I see no value in it atm. inb4 i curse myself later
    }
}

function Get-HeroAugmentDirectories {
    param (
        $directory
    )
    $result = Get-ChildItem -Directory -Recurse | Where-Object { $_ | Get-ChildItem -File | Select -First 1 }
    return $result;
}

Get-HeroAugmentDirectories -directory $(Get-Location) | ForEach-Object { New-AugmentJson $_.FullName }


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
function GetAugments($directory) {
    return $directory | Get-ChildItem -File -Filter *.json | Sort-Object -Property Name | Get-Content -Raw | ConvertFrom-Json
}

function Get-HeroJson() {
    param (
        $directory
    )
    $allAugs = $directory | Get-ChildItem -Directory | ForEach-Object {
        foreach ($category in $_) {
            if ($category.Name -eq "ULT") {
                $augmentCategory = @{
                    Type     = $category.Name;
                    Contents = GetAugments($category)
                }
                $augmentCategory
                continue;
            }
            
            $augmentCategory = @{
                Type     = $category.Name;
                Contents = @()
            }
            foreach ($subCategory in ($category | Get-ChildItem -Directory)) {
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
    }
    $heroIcon = $directory | Get-ChildItem -File -Filter icon.png | Select-Object -First 1
    $locationPathSplit = (($directory).Path.Split('\'))
    $result = @{
        Id       = -1;
        Name     = $locationPathSplit[$locationPathSplit.Count -1] 
        IconName = $heroIcon.Name;
        Augments = @()
    }
    $result["Augments"] = $allAugs
    $result
}

Get-HeroJson (Get-Location) | ConvertTo-Json -Depth 7 |  Out-File HeroInfo.json


