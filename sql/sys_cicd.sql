/*
 Navicat Premium Data Transfer

 Source Server         : 白菜云
 Source Server Type    : MySQL
 Source Server Version : 80034 (8.0.34)
 Source Host           : 82.157.29.198:3306
 Source Schema         : git_single

 Target Server Type    : MySQL
 Target Server Version : 80034 (8.0.34)
 File Encoding         : 65001

 Date: 08/01/2024 14:26:16
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for sys_cicd
-- ----------------------------
DROP TABLE IF EXISTS `sys_cicd`;
CREATE TABLE `sys_cicd`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '项目名称',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `branch` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '项目分支',
  `num` int NULL DEFAULT 0 COMMENT '打包次数',
  `git` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT 'git地址',
  `deploy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '部署地址',
  `host` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '服务器ssh 地址',
  `port` int NULL DEFAULT NULL COMMENT '服务器端口号',
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT 'ssh用户名',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT 'ssh 密码',
  `type` int NULL DEFAULT NULL COMMENT '项目类型， 0 npm， 1 maven',
  `state` int NULL DEFAULT 0 COMMENT '项目状态， 0 初始化 ， 1 代码更新失败， 代买更新完成， 3 代码构建合纵，4代码构建完成， 5 项目部署中，6 项目部署完成',
  `state_str` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '状态字符， 任意',
  `del` int NULL DEFAULT 0 COMMENT ' 1 删除',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `build_time` datetime NULL DEFAULT NULL COMMENT '构建时间',
  `git_time` datetime NULL DEFAULT NULL COMMENT '拉取时间',
  `deploy_time` datetime NULL DEFAULT NULL COMMENT '部署时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
