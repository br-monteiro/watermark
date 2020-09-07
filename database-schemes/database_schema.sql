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
  `item_id` VARCHAR(45) NOT NULL,
  `status` VARCHAR(10) NOT NULL DEFAULT 'queued',
  `feedback_url` TEXT NOT NULL,
  `base_image_path` TEXT NOT NULL,
  `type` VARCHAR(5) NOT NULL,
  `details_text` VARCHAR(100) NULL,
  `details_size` INT(2) NULL,
  `details_color` VARCHAR(6) NULL,
  `details_path` TEXT NULL,
  `position_x` INT(5) NOT NULL,
  `position_y` INT(5) NOT NULL,
  `position_height` INT(5) NOT NULL,
  `position_width` INT(5) NOT NULL,
  `attempt` INT(2) NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
