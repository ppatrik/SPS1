# OpenCV

## Priprava prostredia

Stiahnut z oficialnej stranky aktualnu verziu [OpenCV 3.2.0](http://opencv.org/releases.html) a rozbalit do lub. priecinka

V pocitaci si nastavit premenne prostredia
OPENCV_DIR = ... # miesto kde ste rozbalili opencv obsahujuce priecinky build a sources
OPENCV_VER = 320 # pouzivame verziu 3.2.0

## Vytvorenie projektu

Vo Visual Studio vytvorime novy c++ projekt Console Application - Empty project. Pri vytvarani zrusime Precompiled header a Security Development Lifecycle (SDL) checks.

OpenCV je len pre platformu x64 a preto zrusime podporu projektu pre x86. V hornej časti Visual Studio najdeme selectbox x86 (vedla tlacidla spustenia) a vyberieme **Configuration Manager...**. V Active solution platform vyberieme možnosť **<Edit>** a zmažeme platformu x86.

Vytvorime subor Source.cpp a vyskusame ci kompilacia prebehne v poriadku.

```
#include <iostream>

using namespace std;

int main()
{
	cout << "Hello world" << endl;
	return 0;
}
```

Otvorime **Properties** projektu (pravy klik na ConsoleApplication projekt alebo Alt+Enter), vyberieme Configuration: All Configurations.

**a) Nastavenie include priecinku**

Configuration Properties > C/C++, vyberieme Additional Include Directories a pridame 
```
$(OPENCV_DIR)\build\include
```

**b) Nastavenie libraties priecinku**

Configuration Properties > Linker, vyberieme Additional Library Directories a pridame
```
$(OPENCV_DIR)\build\x64\vc14\lib
```

**c) Nastavenie nazvov kniznic**

Configuration Properties > Linker > Input, vyberieme Additional Dependencies a pridame
```
opencv_world$(OPENCV_VER).lib
```

**d) Pridanie opencv_world.dll do skopilovaneho projektu**

Configuration Properties > Build Events > Post-Build Event, vyberieme Command Line a pridame
```
xcopy /y  "$(OPENCV_DIR)\build\x64\vc14\bin\opencv_world$(OPENCV_VER).dll" "$(OutDir)"
```


Dáme aplikovať zmeny a vyberieme Configuration: Debug zopakujeme kroky c) a d) ale vlozime za $(OPENCV_VER) pismeno d (aby sme mohli debugovat)

**c)**
```
opencv_world$(OPENCV_VER)d.lib
```

**d)**
```
xcopy /y  "$(OPENCV_DIR)\build\x64\vc14\bin\opencv_world$(OPENCV_VER).dll" "$(OutDir)"
```

> Vyskusajme spustit projekt

## Nacitanie obrazku pomocou OpenCV

Upravme subor Source.cpp aby nacital obrazok do matice

```
#include <opencv2\core.hpp>
#include <opencv2\imgcodecs.hpp>
#include <opencv2\highgui.hpp>

// aby sme mohli pouzivat skrateny zapis tried napr. Mat namiesto cv::Mat
using namespace cv;

int main()
{
	// cv::Mat m = cv::imreag(".."); // bez using namespace
	Mat m = imread("C:\\Users\\patrik\\Downloads\\1489872650_girl.png"); // s using namespace cv;
	imshow("nieco", m);

	return 0;
}
```

> To be continued... (viac na seminari 30.3.2017)
