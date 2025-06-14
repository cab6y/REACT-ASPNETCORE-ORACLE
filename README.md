# 📝 Setup Instructions

1. Check the DB connection string inside `React-AspNetCore.Server/appsettings.json`.

2. In Visual Studio, right-click `React-AspNetCore.Server` and select **Set as Startup Project**.

3. Open terminal and run the following commands to start the React frontend:

   ```bash
   cd react-aspnetcore.client
   npm install
   npm run dev
   ```

   > React will start on  https://localhost:60295/

4. In Visual Studio, go to `Tools > NuGet Package Manager > Package Manager Console`.  
   Set the default project to `React-AspNetCore.Server`, then run:

   ```powershell
   Update-Database
   ```

5. Press `F5` in Visual Studio to start the backend (`https://localhost:7044/`).  
   The backend should connect to the running frontend via proxy if configured.
