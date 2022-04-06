section .data
        filename db "file.txt",0
        text db "Hello file!"

section .text
        global _start

_start:
        ;Open the file
        mov rax, 2              ; sys_open
        mov rdi, filename       ;Pointer to file name
        mov rsi, 64+1           ;O_CREAT+O_WRONLY
        mov rdx, 0644o          ;Octal value for the file permissions
        syscall

        push rax                ;Push file descriptor onto the stack

        ;Write to the file
        mov rdi, rax            ;Move file descriptor to expected register for sys_write
        mov rax, 1              ; sys_write
        mov rsi, text           ;Location in memory for the string
        mov rdx, 11             ;Length of text buffer to be written
        syscall

        ;Close the file
        mov rax, 3              ; sys_close
        pop rdi                 ;File descriptor of the file to close
        syscall

        ;Exit program
        mov rax, 60             ; sys_exit
        mov rdi, 0              ;Error code value for no error
        syscall
