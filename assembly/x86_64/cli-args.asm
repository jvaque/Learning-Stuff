section .data
        textArgCount db "Argument(s): ",0
        textArgNum_1 db "Argument #",0
        textArgNum_2 db ": ",0
        newLine db 10,0

section .bss
        digitSpace resb 100
        digitSpacePos resb 8

        argCount resb 8
        argPos resb 8

section .text
        global _start

_start:
        mov rax, 0
        mov [argPos], rax

        mov rax, textArgCount           ;Print out "Argument(s): XX\n" where XX is the argument count as it's the first
        call _print                     ;element in the stack when the program starts
        pop rax
        mov [argCount], rax
        call _printInt                  ;Value is already in rax register
        mov rax, newLine
        call _print

_printArgsLoop:                         ;Print out each argument, displaying the argument number and it's value. This
        mov rax, textArgNum_1           ;values are stored on the stack when the program starts by the operating
        call _print
        mov rax, [argPos]
        inc rax
        mov [argPos], rax
        call _printInt
        mov rax, textArgNum_2
        call _print
        pop rax
        call _print
        mov rax, newLine
        call _print

        mov rax, [argPos]
        mov rbx, [argCount]
        cmp rax, rbx
        jne _printArgsLoop

_exit:
        mov rax, 60
        mov rdi, 0
        syscall

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

;input: rax as int value
;output: print value at rax out as string
_printInt:
        ;In order to print out a number we are going to fill the digitSpace
        ;buffer reversed, so if for example we had to print 1234 the buffer
        ;would get filled ['\n','4','3','2','1'], this allows us to later on
        ;traverse it backwards and print to the screen "1234\n". This two
        ;sections are performed in two loops _printIntLoop_ParseInt fills the
        ;buffer in reverse order, and then _printIntLoop_PrintChar traverses the
        ;buffer backwards and prints the result
        mov rcx, digitSpace
        ;;;;mov rbx, 10                             ;Newline
        ;;;;mov [rcx], rbx
        ;;;;inc rcx
        mov [digitSpacePos], rcx

_printIntLoop_ParseInt:
        mov rdx, 0                              ;Ensure upper division bits are set to zero
        mov rbx, 10                             ;Divide by ten
        div rbx
        push rax
        add rdx, 48                             ;Flipping bits to convert binary number to ascii

        mov rcx, [digitSpacePos]
        mov [rcx], dl
        inc rcx
        mov [digitSpacePos], rcx

        pop rax
        cmp rax, 0
        jne _printIntLoop_ParseInt

        mov rcx, [digitSpacePos]
        dec rcx
        mov [digitSpacePos], rcx

_printIntLoop_PrintChar:
        mov rcx, [digitSpacePos]

        mov rax, 1
        mov rdi, 1
        mov rsi, rcx
        mov rdx, 1
        syscall                                 ;Print out one character at a time

        mov rcx, [digitSpacePos]
        dec rcx
        mov [digitSpacePos], rcx

        cmp rcx, digitSpace
        jge _printIntLoop_PrintChar

        ret
