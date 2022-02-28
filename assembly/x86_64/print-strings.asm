section .data
        text db "Hello, World!",10,0    ;Define null terminated string
        huzza db "Huzzah! Now you can print arbitrary lenth null terminated strings",10,0

section .text
        global _start

_start:
        mov rax, text                   ;Load values needed by the subroutine
        call _print                     ;Call subroutine

        mov rax, huzza
        call _print

                                        ; sys_exit(0)
        mov rax, 60                     ;System call ID for sys_exit
        mov rdi, 0                      ;Error code value for no error
        syscall                         ;Invoke kernel system call

;input: rax as pointer to string
;output: print string at rax
_print:
        push rax                        ;Save value of rax for later
        mov rbx, 0                      ;Initialize value or rbx to zero to act
                                        ; as the string length count
_printLoop:
        inc rax                         ;Increment rax register
        inc rbx                         ;Increment rbx register
        mov cl, [rax]                   ;Move into the 8 bit equivalent of rcx
                                        ; the value pointed by rax
        cmp cl, 0                       ;Compare cl to zero (end of the string)
        jne _printLoop                  ;Jump if not equal to _printLoop

        mov rax, 1                      ;Invoke syscall to print string
        mov rdi, 1
        pop rsi                         ;Pop value from the stack into rsi register
        mov rdx, rbx
        syscall

        ret                             ;Return from subroutine