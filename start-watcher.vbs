Set WshShell = CreateObject("WScript.Shell")
WshShell.Run """C:\Users\Andre\Documents\projects\ai-analysis\start-watcher.bat""", 7, False

Dim http, i, ok
ok = False
For i = 1 To 15
  WScript.Sleep 1000
  On Error Resume Next
  Set http = CreateObject("MSXML2.XMLHTTP")
  http.Open "GET", "http://localhost:7890/status", False
  http.Send
  If Err.Number = 0 And http.Status = 200 Then
    ok = True
    Exit For
  End If
  Err.Clear
  On Error GoTo 0
Next

If ok Then
  WshShell.Run "http://localhost:7890/", 1, False
Else
  MsgBox "Watcher failed to start within 15 seconds." & vbCrLf & vbCrLf & "Check watcher.log for details.", 16, "Watcher"
End If
