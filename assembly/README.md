# Assembly

Wanting to learn some assembly for no good reason but to learn some assembly. The objective is not to develop an amazing application or program but just to do some stuff using nothing more than assembly.

The assembly programs written are targetting **x86_64** (or if you preffer another name **x64**, **AMD64**, **Intel 64**) systems running linux.

The tools needed to build the executable are **nasm** and **ld**.

```
sudo apt install nasm
```


To assemble first need to run `nasm -f elf64 -o hello-world.o hello-world.asm` that gives us an object file and then we need to link it using `ld hello-world.o -o hello-world`

Make sure to use only **LF** line end sequence

Look into using **gas** instead of **nasm**