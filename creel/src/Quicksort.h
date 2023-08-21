int Partition(unsigned int* data, int lo, int hi)
{
    unsigned int pivot = data[lo + (hi - lo) / 2];
    int i = lo - 1;
    int j = hi + 1;

    for (;;)
    {
        do {} while (data[++i] < pivot);
        do {} while (data[--j] > pivot);

        if (i >= j)
            return j;

        // Swap [i] and [j]
        unsigned int tmp = data[i];
        data[i] = data[j];
        data[j] = tmp;
    }
}

void QuickSort(unsigned int* data, int lo, int hi)
{
    if (lo < hi)
    {
        int p = Partition(data, lo, hi);
        QuickSort(data, lo, p);
        QuickSort(data, p + 1, hi);
    }
}

void QuickSort(unsigned int* data, int count)
{
    if (count <= 1) return; // Added base case

    QuickSort(data, 0, count - 1);
}