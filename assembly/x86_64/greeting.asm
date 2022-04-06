; data section is where data is defined before compilation
section .data
        query db "What is your name? "
        greeting db "Hello, "

; bss section is where data is allocated for future use
section .bss
        name resb 16                    ;Reserve 16 bytes

; text section is where the actual code goes
section .text
        global _start

;_start is a label for a section of code
_start:
        call _printQuery
        call _getName
        call _printGreeting
        call _printName

                                        ; sys_exit(0)
        mov rax, 60                     ;System call ID for sys_exit
        mov rdi, 0                      ;Error code value for no error
        syscall                         ;Invoke kernel system call

_getName:
        mov rax, 0                      ; sys_read
        mov rdi, 0
        mov rsi, name
        mov rdx, 16
        syscall
        ret

_printQuery:
        mov rax, 1
        mov rdi, 1
        mov rsi, query
        mov rdx, 19
        syscall
        ret

_printGreeting:
        mov rax, 1
        mov rdi, 1
        mov rsi, greeting
        mov rdx, 7
        syscall
        ret

_printName:
        mov rax, 1
        mov rdi, 1
        mov rsi, name
        mov rdx, 16
        syscall
        ret
