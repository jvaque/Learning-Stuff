#---------------------------------------------------------------------------------------------------
# CMake Build Configuration for some random stuff
#
# See README.md for guidance.
#---------------------------------------------------------------------------------------------------

cmake_minimum_required ( VERSION 3.1.0 )

project ( creel
  VERSION 3.0.0
  LANGUAGES CXX
)

# Set to c++11
set ( CMAKE_CXX_STANDARD 11 )

# Source
set ( SOURCE_SORTING_EXERCISE
  src/main.cpp
  src/Quicksort.h
  src/RadixSort256.h
)

# Executables
add_executable(sortingExercise   ${SOURCE_SORTING_EXERCISE})
