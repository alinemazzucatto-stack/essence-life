Set WshShell = CreateObject("WScript.Shell")
projectPath = "C:\Users\Aline\.codex\.chatgpt-projects\g-p-6a68e7c08f448191a9b5956c352e4430\conecta-life-app"
WshShell.CurrentDirectory = projectPath
WshShell.Run "cmd /c npm run dev > """ & projectPath & "\servidor-log.txt"" 2>&1", 0, False
