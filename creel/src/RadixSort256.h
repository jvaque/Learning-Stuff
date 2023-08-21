static void RadixSort256(unsigned int* arr, int n)
{
    if (n <= 1) return; // Added base case

    unsigned int* output = new unsigned int[n]; // output array
    int* count = new int[256];
    unsigned int* originalArr = arr; // So we know which pointer was the original input

    for (int shift = 0, s = 0; shift < 4; shift++, s += 8)
    {
        // Zero the counts
        for (int i = 0; i < 256; i++)
            count[i] = 0;

        // Store count of occurrences in count[]
        for (int i = 0; i < n; i++)
            count[(arr[i] >> s)&0xff]++;

        // Change count[i] so that count[i] now contains
        // actual position of this digit in output[]
        for (int i = 1; i < 256; i++)
            count[i] += count[i - 1];

        // Build the output array
        for (int i = n - 1; i >= 0; i--)
        {
            // precalculate the offset as it's a few instructions
            int idx = (arr[i] >> s) & 0xff;

            // Subtract from the count and store the value
            output[--count[idx]] = arr[i];
        }

        // Copy the output array to input[], so that input[] 
        // is sorted according to current digit

        // We can just swap the pointers
        unsigned int* tmp = arr;
        arr = output;
        output = tmp;
    }

    // If we switched pointers an odd number of times,
    // make sure we copy before returning
    if (originalArr == output)
    {
        unsigned int* tmp = arr;
        arr = output;
        output = tmp;
    
        for (int i = 0; i < n; i++)
            arr[i] = output[i];
    }

    delete[] output;
    delete[] count;
}
