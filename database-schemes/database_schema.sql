-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema queue_processor
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema queue_processor
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `queue_processor` DEFAULT CHARACTER SET utf8 ;
USE `queue_processor` ;

-- -----------------------------------------------------
-- Table `queue_processor`.`queue`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `queue_processor`.`queue` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `status` VARCHAR(10) NOT NULL DEFAULT 'queued' COMMENT 'The status should be: error, processing, processed, queued',
  `itemId` VARCHAR(20) NOT NULL COMMENT 'The id of Item',
  `groupId` VARCHAR(20) NOT NULL COMMENT 'The Campaign id',
  `feedback_url` TEXT NOT NULL,
  `type` VARCHAR(5) NOT NULL DEFAULT 'text',
  `imageId` VARCHAR(20) NOT NULL COMMENT 'the image id',
  `content` TEXT NOT NULL DEFAULT '{}' COMMENT 'The JSON value',
  `attempt` INT(2) NULL DEFAULT 0 COMMENT 'The number of attempts of processor',
  `created_at` DATETIME NULL,
  `updated_at` DATETIME NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
