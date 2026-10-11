@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ================================================================
echo   تثبيت خدمة SDI Schedule Analyzer كخدمة نظام دائمة (Windows Service)
echo   معهد الشارقة للسياقة - Sharjah Driving Institute
echo ================================================================
echo.
echo [1/2] التحقق من صلاحيات المسؤول (Administrator)...
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [!] تنبيه: يرجى تشغيل هذا الملف كمسؤول (Right-click -> Run as administrator)
    echo     للسماح لويندوز بتسجيل الخدمة في نظام الخدمات (services.msc).
    echo.
    pause
    exit /b 1
)

echo [2/2] جاري تسجيل وتفعيل الخدمة في خدمات ويندوز...
node install-service.js
echo.
echo ================================================================
echo   اكتمل التثبيت! اضغط أي مفتاح للإغلاق.
echo ================================================================
pause
