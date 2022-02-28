# Assembly

Wanting to learn some assembly for no good reason but to learn some assembly. The objective is not to develop an amazing application or program but just to do some stuff using nothing more than assembly.

The assembly programs written are targetting **x86_64** (or if you preffer another name **x64**, **AMD64**, **Intel 64**) systems running linux.

The tools needed to build the executable are **nasm** and **ld**.

```
sudo apt install nasm
```


To assemble first need to run `nasm -f elf64 hello-world.asm -o hello-world.o` that gives us an object file and then we need to link it using `ld hello-world.o -o hello-world`

ELF stands for Executable and Linkable Format

BSS stands for Block Starting Symbol

Make sure to use only **LF** line end sequence

Look into using **gas** instead of **nasm**

### References

[x86_64 Linux Assembly](https://www.youtube.com/playlist?list=PLetF-YjXm-sCH6FrTz4AQhfH6INDQvQSn) playlist by [kupala](https://www.youtube.com/user/khoraski)

### TODO

Look through the video series and convert the different tables with usefull informtion into markdown for the readme