; data section is where data is defined before compilation
section .data
        text db "Hello, World!",10      ;Define bytes "Hello, World!\n" and
                                        ; label the memory address as "text" 

; bss section is where data is allocated for future use
;hello-world program doesn't need a bss section

; text section is where the actual code goes
section .text
        global _start

;_start is a label for a section of code
_start:
                                        ; sys_write(1, text, 14)
        mov rax, 1                      ;System call ID for sys_write
        mov rdi, 1                      ;File descriptor for Standard Output
        mov rsi, text                   ;Location in memory for the string to write
        mov rdx, 14                     ;Length of the string to write
        syscall                         ;Invoke kernel system call

                                        ; sys_exit(0)
        mov rax, 60                     ;System call ID for sys_exit
        mov rdi, 0                      ;Error code value for no error
        syscall                         ;Invoke kernel system call
