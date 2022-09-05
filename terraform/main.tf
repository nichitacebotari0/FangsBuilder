terraform {
  backend "azurerm" {
    resource_group_name  = "CVWebsite"
    storage_account_name = "prodstacvwebsite"
    container_name       = "tfstate"
    key                  = "FangsBuilder.tfstate"
  }

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>3.0"
    }
  }
}

provider "azurerm" {
  version = "~>3.0"
  features {}
}

resource "azurerm_resource_group" "resource_group" {
  name = "FangsBuilder"
  location = "West Europe"
}

resource "azurerm_storage_account" "storage_account" {
  name                     = "prodstaFangsBuilder"
  resource_group_name      = data.azurerm_resource_group.resource_group.name
  location                 = data.azurerm_resource_group.resource_group.location
  account_kind             = "StorageV2"
  account_tier             = "Standard"
  account_replication_type = "LRS"

    static_website {
    index_document = "index.html"
  }
}

output StorageAccountName {
  value = azurerm_storage_account.storage_account.name
}


