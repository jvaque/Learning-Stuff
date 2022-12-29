# Ray Tracing

Following the [Ray Tracing books](https://github.com/RayTracing/raytracing.github.io/tree/master) v3.2.3 to do some ray tracing in cpp

## Build environment

```
$ sudo apt install build-essential
```

## CMake

Need to figure out more about CMake!

Set up CMake build directory.

```
$ mkdir build
$ cd build
$ cmake ..
```

Build InOneWeekend source code.

```
$ make inOneWeekend
```

??? `cmake -S ./ -B ./build` ???

## Project structure

TBD

```
./inOneWeekend > ../images/InOneWeekend/image_xx.ppm
```

View images using the (PBM/PPM/PGM Viewer for Visual Studio Code)[https://marketplace.visualstudio.com/items?itemName=ngtystr.ppm-pgm-viewer-for-vscode] VS Code extension