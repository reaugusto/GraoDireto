CREATE DATABASE  IF NOT EXISTS `microblog_dev` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `microblog_dev`;
-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: microblog_dev
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `post_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (3,1,1,'dhasdhçladojadnvçosalfnvsfav','2026-05-13 17:17:54'),(6,3,1,'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed aliquet sit amet felis a ultrices. Fusce eget ultricies odio. Etiam laoreet arcu sem, nec posuere purus dapibus vitae.','2026-05-13 22:13:55'),(7,2,1,'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed aliquet sit amet felis a ultrices. Fusce eget ultricies odio. Etiam laoreet arcu sem, nec posuere purus dapibus vitae.','2026-05-13 22:15:04'),(8,1,4,'Etiam et imperdiet ipsum. Mauris ullamcorper ante felis, vitae elementum tellus consectetur eget. Integer quis arcu nec turpis commodo faucibus. Sed et facilisis nulla, at vehicula nunc. Etiam nulla nulla, placerat vel elit in, ultrices fringilla sapien. ','2026-05-14 01:23:14');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_tags`
--

DROP TABLE IF EXISTS `post_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_tags` (
  `post_id` int NOT NULL,
  `tag_id` int NOT NULL,
  PRIMARY KEY (`post_id`,`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_tags`
--

LOCK TABLES `post_tags` WRITE;
/*!40000 ALTER TABLE `post_tags` DISABLE KEYS */;
INSERT INTO `post_tags` VALUES (1,1),(1,2),(1,3),(2,4),(2,5),(2,6),(15,6),(15,18),(15,36);
/*!40000 ALTER TABLE `post_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `author_id` int DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `content` longtext,
  `slug` varchar(255) NOT NULL,
  `published_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,1,'A Revolução da Grão Direto no Agronegócio','A Grão Direto tem transformado o setor agrícola ao introduzir tecnologia de ponta para conectar produtores e compradores de grãos. A plataforma utiliza algoritmos avançados para recomendar preços baseados em dados de mercado em tempo real. Além disso, sua interface amigável e acessível facilita negociações seguras e rápidas. Baseada em Uberaba, Minas Gerais, a empresa continua a liderar a digitalização do agronegócio no Brasil, fortalecendo toda a cadeia produtiva com inovações tecnológicas.','revolucao-grao-direto','2026-05-13 01:50:55'),(2,2,'Implementando CI/CD em Ambientes Ágeis','A prática de integração contínua (CI) e entrega contínua (CD) tem se tornado essencial no desenvolvimento de software moderno. Ferramentas como Jenkins, GitHub Actions e CircleCI permitem automatizar a pipeline de deploy, garantindo entregas mais rápidas e com menor probabilidade de erros. No contexto de projetos ágeis, a adoção de CI/CD não só melhora a qualidade do código como também aumenta a confiança entre as equipes de desenvolvimento e operações. Com pipelines bem configuradas, é possível reduzir significativamente o tempo de entrega de novas funcionalidades.','ci-cd-ambientes-ageis','2026-05-13 01:50:55'),(3,3,'A Importância de Bancos de Dados NoSQL em Sistemas Escaláveis','Com o crescimento exponencial de dados, bancos de dados NoSQL, como MongoDB, Cassandra e DynamoDB, têm se destacado por sua flexibilidade e escalabilidade. Diferente dos bancos de dados relacionais, os NoSQL permitem armazenar grandes volumes de dados não estruturados, sendo ideais para aplicações modernas como redes sociais, plataformas de e-commerce e sistemas de recomendação. O uso correto dessas tecnologias pode melhorar a performance e garantir a disponibilidade do sistema mesmo sob alta demanda.','importancia-nosql-escalaveis','2026-05-13 01:50:55'),(4,4,'Como Kubernetes Revolucionou a Orquestração de Contêineres','Kubernetes se tornou a principal solução para orquestração de contêineres, permitindo a implantação, escalabilidade e gerenciamento de aplicações de forma eficiente. Empresas de todos os portes têm adotado essa tecnologia devido à sua capacidade de garantir alta disponibilidade e resiliência. A configuração de clusters em Kubernetes também facilita o monitoramento de recursos e a automatização de tarefas, como balanceamento de carga e escalonamento automático. Para quem busca modernizar suas operações, Kubernetes é uma escolha indispensável.','kubernetes-orquestracao-conteineres','2026-05-13 01:50:55'),(5,2,'Os Desafios da Segurança em Arquiteturas Serverless','As arquiteturas serverless oferecem muitas vantagens, como redução de custos e facilidade de escalabilidade. No entanto, também trazem desafios únicos de segurança. A ausência de servidores físicos não elimina a necessidade de proteger endpoints, gerenciar permissões e garantir que as funções lambdas estejam livres de vulnerabilidades. Ferramentas como AWS Lambda, Azure Functions e Google Cloud Functions exigem boas práticas de configuração e monitoramento contínuo para evitar ataques como injeção de código ou acesso não autorizado.','seguranca-arquiteturas-serverless','2026-05-13 01:50:55'),(6,3,'Práticas de DevOps para Times Distribuídos','A colaboração em times distribuídos pode ser um desafio, mas práticas de DevOps ajudam a alinhar objetivos e acelerar entregas. Ferramentas como Docker, Kubernetes e Terraform garantem ambientes consistentes para desenvolvimento e produção, enquanto plataformas de comunicação como Slack e Microsoft Teams mantêm a equipe conectada. A automação de tarefas rotineiras também é fundamental para que os desenvolvedores se concentrem em tarefas críticas, promovendo um fluxo de trabalho mais eficiente.','devops-times-distribuidos','2026-05-13 01:50:55'),(7,4,'A Evolução do Desenvolvimento Frontend com Frameworks Modernos','Nos últimos anos, o desenvolvimento frontend passou por uma grande evolução graças a frameworks como React, Angular e Vue.js. Essas ferramentas permitem a criação de interfaces dinâmicas e responsivas com maior facilidade, melhorando a experiência do usuário final. Além disso, a adoção de conceitos como componentização e state management trouxe mais organização ao código, facilitando a manutenção e a escalabilidade de projetos.','evolucao-frontend-frameworks','2026-05-13 01:50:55'),(8,1,'O Futuro do Agronegócio com a Grão Direto','A Grão Direto continua a liderar a transformação digital no agronegócio brasileiro. A empresa não apenas conecta compradores e vendedores, mas também utiliza tecnologias como aprendizado de máquina e análise preditiva para otimizar transações. Com sede em Uberaba, Minas Gerais, a agtech está na vanguarda das inovações, trazendo mais eficiência e sustentabilidade ao setor. O uso de dados para prever tendências de mercado e gerenciar estoques em tempo real é uma das principais contribuições da Grão Direto.','futuro-agronegocio-grao-direto','2026-05-13 01:50:55'),(15,1,'Etiam et imperdiet ipsum Atualizado','Etiam et imperdiet ipsum. Mauris ullamcorper ante felis, vitae elementum tellus consectetur eget. Integer quis arcu nec turpis commodo faucibus. Sed et facilisis nulla, at vehicula nunc. Etiam nulla nulla, placerat vel elit in, ultrices fringilla sapien. Donec dignissim mauris ut nunc congue, lacinia pretium magna aliquet. Praesent ac tellus sed risus viverra euismod et sed magna. Etiam ut lectus ut risus bibendum consequat et id nunc. Quisque faucibus, lectus vitae malesuada lacinia, purus mi fringilla nisi, vitae tincidunt metus velit in magna. Praesent sagittis fringilla arcu at porta. Sed condimentum urna ac vehicula hendrerit. Sed et egestas ante, eu faucibus ante. Ut auctor nibh nec vehicula fringilla. Maecenas massa lorem, gravida non enim at, accumsan ultrices ipsum. In bibendum, metus sed viverra interdum, arcu velit scelerisque nulla, vitae aliquet tortor mi eget nunc. Nulla ut rhoncus arcu.','etiam-et-imperdiet-ipsum-atualizado','2026-05-14 03:21:55');
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tags` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
INSERT INTO `tags` VALUES (36,' Teste'),(6,'agilidade'),(3,'agronegócio'),(8,'banco de dados'),(4,'CI/CD'),(15,'cloud'),(16,'colaboração'),(11,'contêineres'),(5,'devops'),(9,'escalabilidade'),(19,'frameworks'),(18,'frontend'),(1,'Grão Direto'),(21,'inovação'),(10,'Kubernetes'),(7,'NoSQL'),(12,'orquestração'),(20,'React'),(14,'segurança'),(13,'serverless'),(2,'tecnologia'),(25,'Teste'),(17,'times distribuídos');
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `role` varchar(20) DEFAULT 'reader',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Fred Marques','fred@graodireto.com.br','author','2026-05-09 15:32:09','123alterar'),(2,'Carlos Henrique','carlos.h@dev.com','author','2026-05-09 15:32:09','123alterar'),(3,'Carlos Eduardo','carlos.e@dev.com','author','2026-05-09 15:32:09','123alterar'),(4,'Geovana Rocha','geovana@dev.com','author','2026-05-09 15:32:09','123alterar');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'microblog_dev'
--

--
-- Dumping routines for database 'microblog_dev'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-14 12:31:56
