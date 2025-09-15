Add-Type -AssemblyName System.Drawing

# Redimensionar tecnología a 600x400
$imgTech = [System.Drawing.Image]::FromFile("d:\Empresas\AquatechIA\webpage\apps\web\public\images\technology-3389904_1280.jpg")
$bitmapTech = New-Object System.Drawing.Bitmap(600, 400)
$graphicsTech = [System.Drawing.Graphics]::FromImage($bitmapTech)
$graphicsTech.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphicsTech.DrawImage($imgTech, 0, 0, 600, 400)
$bitmapTech.Save("d:\Empresas\AquatechIA\webpage\apps\web\public\images\technology-600x400.jpg")
$imgTech.Dispose()
$bitmapTech.Dispose()
$graphicsTech.Dispose()

# Redimensionar montañas a 600x400
$imgMountains = [System.Drawing.Image]::FromFile("d:\Empresas\AquatechIA\webpage\apps\web\public\images\mountains-1899264_1280.jpg")
$bitmapMountains = New-Object System.Drawing.Bitmap(600, 400)
$graphicsMountains = [System.Drawing.Graphics]::FromImage($bitmapMountains)
$graphicsMountains.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphicsMountains.DrawImage($imgMountains, 0, 0, 600, 400)
$bitmapMountains.Save("d:\Empresas\AquatechIA\webpage\apps\web\public\images\mountains-600x400.jpg")
$imgMountains.Dispose()
$bitmapMountains.Dispose()
$graphicsMountains.Dispose()

Write-Host "Imágenes redimensionadas exitosamente:"
Write-Host "- technology-600x400.jpg"
Write-Host "- mountains-600x400.jpg"
