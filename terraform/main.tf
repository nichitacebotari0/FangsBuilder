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
  features {}
}

resource "azurerm_resource_group" "resource_group" {
  name     = "FangsBuilder"
  location = "West Europe"
}

resource "azurerm_storage_account" "storage_account" {
  name                     = "prodstafangsbuilder"
  resource_group_name      = azurerm_resource_group.resource_group.name
  location                 = azurerm_resource_group.resource_group.location
  account_kind             = "StorageV2"
  account_tier             = "Standard"
  account_replication_type = "LRS"

  static_website {
    index_document = "index.html"
  }
}

output "staname" {
  value = azurerm_storage_account.storage_account.name
}
