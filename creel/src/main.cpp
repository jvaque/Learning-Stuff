#include <iostream>
#include <ctime>

#include "RadixSort256.h"
#include "Quicksort.h"

// George Marsaglia's XOR Shift random generator from wikipedia:
// https://en.wikipedia.org/wiki/Xorshift

unsigned int state = 123;
unsigned int xorshift32()
{
    state ^= state << 13;
    state ^= state >> 17;
    state ^= state << 5;
    return state;
}

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
            QuickSort(arr, COUNT);
            // RadixSort256(arr, COUNT);
        }
        long finishTime = clock();

        std::cout << "Time: " << (finishTime - startTime) << std::endl;
    }

    std::cout << "Sorted list: " << std::endl;
    for (int i = 0; i < 10; i++)
    {
        std::cout << i << "." << arr[i] << std::endl;
    }

    for (int i = 0; i < COUNT - 1; i++)
    {
        if (arr[i] > arr[i+1])
        {
            std::cout << "List is not sorted!" << std::endl;
        }
    }

    delete[] arr;

    std::cin.get();

    return 0;
}