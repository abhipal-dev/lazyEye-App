# Generate LazyEye flat brand assets for Android, iOS, and Mobile App UI
Add-Type -AssemblyName System.Drawing

$baseDir = "D:\Abhishek_Projects\lazyEye_Mobile"

function Draw-LazyEyeLogo {
    param(
        [System.Drawing.Graphics]$g,
        [float]$x,
        [float]$y,
        [float]$size,
        [bool]$darkTheme = $true
    )

    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    # Scale factor from 100x100 reference
    $scale = $size / 100.0

    $cyanColor = [System.Drawing.Color]::FromArgb(255, 2, 132, 199)    # #0284C7
    $redColor  = [System.Drawing.Color]::FromArgb(255, 239, 68, 68)    # #EF4444
    $pupilColor = [System.Drawing.Color]::FromArgb(255, 15, 23, 42)   # #0F172A
    $pupilRing = [System.Drawing.Color]::FromArgb(255, 99, 102, 241)   # #6366F1
    $whiteColor = [System.Drawing.Color]::FromArgb(255, 255, 255, 255)

    # 1. Iris Split: Left (Red) & Right (Cyan)
    # Circle bounds: center (50, 50), r = 26 -> box x=24, y=24, w=52, h=52
    $irisBox = New-Object System.Drawing.RectangleF ($x + 24 * $scale), ($y + 24 * $scale), (52 * $scale), (52 * $scale)
    
    # Left Half Iris (angle 90 to 270)
    $redBrush = New-Object System.Drawing.SolidBrush $redColor
    $g.FillPie($redBrush, $irisBox.X, $irisBox.Y, $irisBox.Width, $irisBox.Height, 90, 180)
    $redBrush.Dispose()

    # Right Half Iris (angle 270 to 90)
    $cyanBrush = New-Object System.Drawing.SolidBrush $cyanColor
    $g.FillPie($cyanBrush, $irisBox.X, $irisBox.Y, $irisBox.Width, $irisBox.Height, 270, 180)
    $cyanBrush.Dispose()

    # 2. Central Pupil
    # Circle r = 14 -> box x=36, y=36, w=28, h=28
    $pupilBox = New-Object System.Drawing.RectangleF ($x + 36 * $scale), ($y + 36 * $scale), (28 * $scale), (28 * $scale)
    $pupilBrush = New-Object System.Drawing.SolidBrush $pupilColor
    $g.FillEllipse($pupilBrush, $pupilBox)
    $pupilBrush.Dispose()

    $ringPen = New-Object System.Drawing.Pen $pupilRing, (3.5 * $scale)
    $g.DrawEllipse($ringPen, $pupilBox)
    $ringPen.Dispose()

    # Pupil center reflection: r = 6 -> box x=44, y=44, w=12, h=12
    $centerReflBox = New-Object System.Drawing.RectangleF ($x + 44 * $scale), ($y + 44 * $scale), (12 * $scale), (12 * $scale)
    $whiteBrush = New-Object System.Drawing.SolidBrush $whiteColor
    $g.FillEllipse($whiteBrush, $centerReflBox)

    # Reflection accent dot: r = 2.5 at (53, 46)
    $dotBox = New-Object System.Drawing.RectangleF ($x + 51.5 * $scale), ($y + 44.5 * $scale), (5.0 * $scale), (5.0 * $scale)
    $dotBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(220, 255, 255, 255))
    $g.FillEllipse($dotBrush, $dotBox)
    $dotBrush.Dispose()
    $whiteBrush.Dispose()

    # 3. Outer Eyelids: Top Lid (Cyan) and Bottom Lid (Red)
    # Quadratic curve M10,50 Q50,12 90,50 -> Cubic control points:
    # P0=(10,50), P1=(50,12), P2=(90,50)
    # CP1 = P0 + 2/3*(P1 - P0) = (10 + 26.67, 50 - 25.33) = (36.67, 24.67)
    # CP2 = P2 + 2/3*(P1 - P2) = (90 - 26.67, 50 - 25.33) = (63.33, 24.67)
    $topPen = New-Object System.Drawing.Pen $cyanColor, (6.0 * $scale)
    $topPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $topPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $g.DrawBezier(
        $topPen,
        ($x + 10 * $scale), ($y + 50 * $scale),
        ($x + 36.67 * $scale), ($y + 24.67 * $scale),
        ($x + 63.33 * $scale), ($y + 24.67 * $scale),
        ($x + 90 * $scale), ($y + 50 * $scale)
    )
    $topPen.Dispose()

    # Bottom Lid (Red): M10,50 Q50,88 90,50
    # CP1 = (36.67, 75.33), CP2 = (63.33, 75.33)
    $botPen = New-Object System.Drawing.Pen $redColor, (6.0 * $scale)
    $botPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $botPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $g.DrawBezier(
        $botPen,
        ($x + 10 * $scale), ($y + 50 * $scale),
        ($x + 36.67 * $scale), ($y + 75.33 * $scale),
        ($x + 63.33 * $scale), ($y + 75.33 * $scale),
        ($x + 90 * $scale), ($y + 50 * $scale)
    )
    $botPen.Dispose()
}

# Generate App Icons
$androidMipmaps = @{
    "mipmap-mdpi"    = 48
    "mipmap-hdpi"    = 72
    "mipmap-xhdpi"   = 96
    "mipmap-xxhdpi"  = 144
    "mipmap-xxxhdpi" = 192
}

foreach ($entry in $androidMipmaps.GetEnumerator()) {
    $folder = $entry.Key
    $px = $entry.Value
    $dir = "$baseDir\android\app\src\main\res\$folder"
    if (!(Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }

    # Standard Square Launcher Icon
    $bmp = New-Object System.Drawing.Bitmap $px, $px
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $bgBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 15, 23, 42)) # #0F172A
    $g.FillRectangle($bgBrush, 0, 0, $px, $px)
    $bgBrush.Dispose()

    $logoSize = $px * 0.78
    $offset = ($px - $logoSize) / 2.0
    Draw-LazyEyeLogo $g $offset $offset $logoSize $true
    $g.Dispose()

    $bmp.Save("$dir\ic_launcher.png", [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()

    # Round Launcher Icon
    $bmpRound = New-Object System.Drawing.Bitmap $px, $px
    $gRound = [System.Drawing.Graphics]::FromImage($bmpRound)
    $gRound.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddEllipse(0, 0, $px, $px)
    $gRound.SetClip($path)

    $bgBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 15, 23, 42))
    $gRound.FillRectangle($bgBrush, 0, 0, $px, $px)
    $bgBrush.Dispose()

    Draw-LazyEyeLogo $gRound $offset $offset $logoSize $true
    $gRound.Dispose()
    $path.Dispose()

    $bmpRound.Save("$dir\ic_launcher_round.png", [System.Drawing.Imaging.ImageFormat]::Png)
    $bmpRound.Dispose()
    Write-Host "Generated $folder icons at ${px}px"
}

# Android Adaptive Icon Foreground (432x432)
$drawDir = "$baseDir\android\app\src\main\res\drawable"
if (!(Test-Path $drawDir)) { New-Item -ItemType Directory -Force -Path $drawDir | Out-Null }

$foreBmp = New-Object System.Drawing.Bitmap 432, 432
$gFore = [System.Drawing.Graphics]::FromImage($foreBmp)
$gFore.Clear([System.Drawing.Color]::Transparent)
# Logo occupies safe zone ~220px in center
Draw-LazyEyeLogo $gFore 106 106 220 $true
$gFore.Dispose()
$foreBmp.Save("$drawDir\ic_launcher_foreground.png", [System.Drawing.Imaging.ImageFormat]::Png)
$foreBmp.Dispose()
Write-Host "Generated ic_launcher_foreground.png (432x432)"

# Create adaptive icon XML background and mipmap-anydpi-v26 XMLs
$anydpiDir = "$baseDir\android\app\src\main\res\mipmap-anydpi-v26"
if (!(Test-Path $anydpiDir)) { New-Item -ItemType Directory -Force -Path $anydpiDir | Out-Null }

@"
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@drawable/ic_launcher_foreground"/>
</adaptive-icon>
"@ | Set-Content "$anydpiDir\ic_launcher.xml"

@"
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@drawable/ic_launcher_foreground"/>
</adaptive-icon>
"@ | Set-Content "$anydpiDir\ic_launcher_round.xml"

# Colors for background
$valuesDir = "$baseDir\android\app\src\main\res\values"
@"
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#0F172A</color>
</resources>
"@ | Set-Content "$valuesDir\colors.xml"

# Generate iOS AppIcon (1024x1024)
$iosIconDir = "$baseDir\ios\LazyEyeMobile\Images.xcassets\AppIcon.appiconset"
if (Test-Path $iosIconDir) {
    $iosBmp = New-Object System.Drawing.Bitmap 1024, 1024
    $gIos = [System.Drawing.Graphics]::FromImage($iosBmp)
    $bgBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 15, 23, 42))
    $gIos.FillRectangle($bgBrush, 0, 0, 1024, 1024)
    $bgBrush.Dispose()
    Draw-LazyEyeLogo $gIos 160 160 704 $true
    $gIos.Dispose()
    $iosBmp.Save("$iosIconDir\AppIcon-1024.png", [System.Drawing.Imaging.ImageFormat]::Png)
    $iosBmp.Dispose()
    Write-Host "Generated iOS AppIcon-1024.png"
}

# Generate In-App Assets in src/assets/logo/
$assetsLogoDir = "$baseDir\src\assets\logo"

# 1. lazyeye_icon.png (Transparent background 512x512)
$iconBmp = New-Object System.Drawing.Bitmap 512, 512
$gIcon = [System.Drawing.Graphics]::FromImage($iconBmp)
$gIcon.Clear([System.Drawing.Color]::Transparent)
Draw-LazyEyeLogo $gIcon 16 16 480 $true
$gIcon.Dispose()
$iconBmp.Save("$assetsLogoDir\lazyeye_icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$iconBmp.Dispose()

# 2. lazyeye_splash_logo.png (512x512 on plain dark background)
$splashBmp = New-Object System.Drawing.Bitmap 512, 512
$gSplash = [System.Drawing.Graphics]::FromImage($splashBmp)
$gSplash.Clear([System.Drawing.Color]::Transparent)
Draw-LazyEyeLogo $gSplash 32 32 448 $true
$gSplash.Dispose()
$splashBmp.Save("$assetsLogoDir\lazyeye_splash_logo.png", [System.Drawing.Imaging.ImageFormat]::Png)
$splashBmp.Dispose()

# 3. lazyeye_header_logo.png (Horizontal brand banner 360x90)
$headerBmp = New-Object System.Drawing.Bitmap 480, 120
$gHead = [System.Drawing.Graphics]::FromImage($headerBmp)
$gHead.Clear([System.Drawing.Color]::Transparent)
$gHead.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$gHead.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

# Draw Eye mark on left
Draw-LazyEyeLogo $gHead 10 10 100 $true

# Draw LazyEye typography
$fontTitle = New-Object System.Drawing.Font ("Arial", [float]40, [System.Drawing.FontStyle]::Bold)
$fontSub   = New-Object System.Drawing.Font ("Arial", [float]11, [System.Drawing.FontStyle]::Bold)

$whiteBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 248, 250, 252))
$cyanBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 2, 132, 199))
$subBrush  = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 148, 163, 184))

$gHead.DrawString("Lazy", $fontTitle, $whiteBrush, 120, 16)
$gHead.DrawString("Eye", $fontTitle, $cyanBrush, 246, 16)
$gHead.DrawString("VISION THERAPY", $fontSub, $subBrush, 124, 76)

$fontTitle.Dispose()
$fontSub.Dispose()
$whiteBrush.Dispose()
$cyanBrush.Dispose()
$subBrush.Dispose()
$gHead.Dispose()

$headerBmp.Save("$assetsLogoDir\lazyeye_header_logo.png", [System.Drawing.Imaging.ImageFormat]::Png)
$headerBmp.Dispose()

Write-Host "All logo assets generated successfully in $assetsLogoDir!"
