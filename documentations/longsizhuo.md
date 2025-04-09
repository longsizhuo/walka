# 后端部分

[//]: # (1. 我加入了Prisma ORM，使用了SQLite数据库来存储数据。运行的时候 **不要登陆**。)

[//]: # (    ```SHELL)

[//]: # (    npx prisma@latest init --db)

[//]: # (    ```)
1. 舔加`.env`
   ```
   DATABASE_URL="mysql://你的名字:123@longsizhuo.com:3306/walka_basic"

[//]: # (   ```)

[//]: # (3. 要将数据模型映射到数据库模式，您需要使用prisma migrateCLI 命令：)

[//]: # (   ```SHELL)

[//]: # (   npx prisma migrate dev )

[//]: # (   ```)

[//]: # (   此命令做了两件事：)

[//]: # (   它为此迁移生成了一个新的 SQL 迁移文件)

[//]: # (   它针对数据库运行了 SQL 迁移文件)

[//]: # (   您可以在新创建的目录中检查生成的 SQL 迁移文件`prisma/migrations`。)
4. `next dev` 打开项目
5. 打开POSTMAN, 右上角的environment记得添加`baseUrl`，值为`http://localhost:3000`
6. 找到`Integration Testing`里的`Register`, 点开`Body/raw`. `Email`是unique键
   ![img_2.png](img_2.png) 你可以测试任意`email`和`password`是否返回回来`200OK`

7. 找到`Integration Testing`里的`Login`, 点开`Body/raw`. `Email`是unique键
   ![img_3.png](img_3.png) 你可以测试任意`email`和`password`是否返回回来`200OK`
   测试注释