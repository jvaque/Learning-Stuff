#include <iostream>
#include <ctime>
#include <algorithm>
#include <cstdlib>
#include <vector>

#include "RadixSort256.h"
#include "Quicksort.h"



void GenerateRandomData(unsigned int* arr, int count, int seed)
{
    state = seed;
    for (int i = 0; i < count; i++)
    {
        arr[i] = xorshift32();
    }
}

int main()
{
    int COUNT = 10;

    unsigned int* arr = new unsigned int[COUNT];

    for (int r = 0; r < 10; r++)
    {
        long startTime = clock();
        for (int i = 0; i < 1; i++)
        {
            GenerateRandomData(arr, COUNT, 123);

        }
        
    }
    
}