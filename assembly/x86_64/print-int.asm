section .bss
        digitSpace resb 100
        digitSpacePos resb 8

section .text
        global _start

_start:
        mov rax, 2048
        call _printInt

        mov rax, 60
        mov rdi, 0
        syscall

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
        mov rbx, 10                             ;Newline
        mov [rcx], rbx
        inc rcx
        mov [digitSpacePos], rcx

_printIntLoop_ParseInt:
        mov rdx, 0                              ;Ensure upper division bits are set to zero
        mov rbx, 10                             ;Divide by ten
        div rbx
        push rax
        add rdx, 48                             ;Flipping bits to convert binary number to ascii representation

        mov rcx, [digitSpacePos]
        mov [rcx], dl
        inc rcx
        mov [digitSpacePos], rcx

        pop rax
        cmp rax, 0
        jne _printIntLoop_ParseInt

        mov rcx, [digitSpacePos]                ;Decrement ponter by one, so that the pointer is pointing to the last
        dec rcx                                 ;added ascii character in the buffer and not to the next free location
        mov [digitSpacePos], rcx                ;on the buffer

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