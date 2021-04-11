import { 
    init,
    initialize_memory,
    initialise_tag,
    newCopy,
    newFlip,
    newPush,
    newPop,
    newAssign,
    newNew,
    scanFlip,
    startFlip,
    resetToSpace
} from "copy_gc"; 


/* 
Virtual machine for language Source §1-
using virtual machine SVML1, Lecture Week 5 of CS4215
Instructions: press "Run" to evaluate an example expression
              (scroll down and un-comment one example)
              
The language Source §1- is defined as follows:
stmt    ::= expr ;
         |  const x = expr ;
         |  return expr ;
         |  stmt stmt ;
expr    ::= number
         |  true | false
         |  expr ? expr : expr
         |  expr && expr
         |  expr || expr
         |  expr binop expr
         |  unop expr
         |  expr ( expr (, expr)* )
         |  ( params ) => { stmt } ;
binop   ::= + | - | * | / | < | > | <= | >= | === | !==
unop    ::= !              
params  ::= ε | name ( , name ) . . .
*/

// SYNTAX OF SOURCE §1 

// Functions from SICP JS Section 4.1.2
// with slight modifications

function is_tagged_list(expr, the_tag) {
    return is_pair(expr) && head(expr) === the_tag;
}

// names are tagged with "name".

function is_name(stmt) {
    return is_tagged_list(stmt, "name");
}
function symbol_of_name(stmt) {
    return head(tail(stmt));
}

function is_literal(stmt) {
    return is_tagged_list(stmt, "literal");
}

function literal_value(component) {    
    return head(tail(component));
}

function make_literal(value) {
    return list("literal", value);
}

function is_undefined_expression(stmt) {     
    return is_name(stmt) && symbol_of_name(stmt) === "undefined";
}

// constant declarations are tagged with "constant_declaration"
// and have "name" and "value" properties

function is_constant_declaration(stmt) {
   return is_tagged_list(stmt, "constant_declaration");
}
function declaration_symbol(component) {
   return symbol_of_name(head(tail(component)));
}
function constant_declaration_value(stmt) {
   return head(tail(tail(stmt)));
}
function make_constant_declaration(name, value_expression) {
    return list("constant_declaration", name, value_expression);
}
function is_declaration(component) {
    return is_tagged_list(component, "constant_declaration") ||
           is_tagged_list(component, "variable_declaration") ||
           is_tagged_list(component, "function_declaration");
}

// applications are tagged with "application"
// and have "operator" and "operands"

function is_application(component) {
   return is_tagged_list(component, "application");
}
function function_expression(component) {
   return head(tail(component));
}
function arg_expressions(component) {
   return head(tail(tail(component)));
}

// we distinguish primitive applications by their
// operator name

function is_operator_combination(component) {	    
    return is_unary_operator_combination(component) ||
           is_binary_operator_combination(component);
}
function is_unary_operator_combination(component) {	    
    return is_tagged_list(component, "unary_operator_combination");
}
function is_binary_operator_combination(component) {	    
    return is_tagged_list(component, "binary_operator_combination");
}
function operator_symbol(component) {
    return list_ref(component, 1);
}
function first_operand(component) {
    return list_ref(component, 2);
}
function second_operand(component) {
    return list_ref(component, 3);
}

// logical compositions are tagged
// with "logical_composition"

function is_logical_composition(expr) {
    return is_tagged_list(expr, "logical_composition");
}
function logical_composition_operator(expr) {
    return head(tail(expr));
}

// conditional expressions are tagged
// with "conditional_expression"

function is_conditional_expression(expr) {
    return is_tagged_list(expr, 
                "conditional_expression");
}
function cond_expr_pred(expr) {
    return list_ref(expr, 1);
}
function cond_expr_cons(expr) {
    return list_ref(expr, 2);
}
function cond_expr_alt(expr) {
    return list_ref(expr, 3);
}
function make_conditional_expression(expr1, expr2, expr3) {
    return list("conditional_expression",
                expr1, expr2, expr3);
}

// lambda expressions are tagged with "lambda_expression"
// have a list of "parameters" and a "body" statement

function is_lambda_expression(component) {
   return is_tagged_list(component, "lambda_expression");
}
function lambda_parameter_symbols(component) {
   return map(symbol_of_name, head(tail(component)));
}
function lambda_body(component) {
   return head(tail(tail(component)));
}
function make_lambda_expression(parameters, body) {
    return list("lambda_expression", parameters, body);
}

// blocks are tagged with "block"
// have "body" statement

function is_block(component) {
    return is_tagged_list(component, "block");
}
function block_body(component) {
    return head(tail(component));
}

// function declarations are tagged with "lambda_expression"
// have a list of "parameters" and a "body" statement

function is_function_declaration(component) {	    
    return is_tagged_list(component, "function_declaration");
}
function function_declaration_name(component) {
    return list_ref(component, 1);
}
function function_declaration_parameters(component) {
    return list_ref(component, 2);
}
function function_declaration_body(component) {
    return list_ref(component, 3);
}
function function_decl_to_constant_decl(component) {
    return make_constant_declaration(
               function_declaration_name(component),
               make_lambda_expression(
                   function_declaration_parameters(component),
                   function_declaration_body(component)));
}

// sequences of statements are just represented
// by tagged lists of statements by the parser.

function is_sequence(stmt) {
   return is_tagged_list(stmt, "sequence");
}
function make_sequence(stmts) {
   return list("sequence", stmts);
}
function sequence_statements(stmt) {   
   return head(tail(stmt));
}
function is_empty_sequence(stmts) {
   return is_null(stmts);
}
function is_last_statement(stmts) {
   return is_null(tail(stmts));
}
function first_statement(stmts) {
   return head(stmts);
}
function rest_statements(stmts) {
   return tail(stmts);
}

// functions return the value that results from
// evaluating their expression

function is_return_statement(stmt) {
   return is_tagged_list(stmt, "return_statement");
}
function return_statement_expression(stmt) {
   return head(tail(stmt));
}

// OP-CODES

// op-codes of machine instructions, used by compiler
// and machine

const START   =  0;
const LDCN    =  1; // followed by: number
const LDCB    =  2; // followed by: boolean
const LDCU    =  3; 
const PLUS    =  4; 
const MINUS   =  5; 
const TIMES   =  6; 
const EQUAL   =  7; 
const LESS    =  8; 
const GREATER =  9; 
const LEQ     = 10; 
const GEQ     = 11; 
const NOT     = 12; 
const DIV     = 13; 
const POP     = 14;
const ASSIGN  = 15; // followed by: index of value in environment
const JOF     = 16; // followed by: jump address
const GOTO    = 17; // followed by: jump address
const LDF     = 18; // followed by: max_stack_size, address, env extensn count
const CALL    = 19; 
const LD      = 20; // followed by: index of value in environment
const RTN     = 21;
const DONE    = 22; 

// some auxiliary constants
// to keep track of the inline data

const LDF_MAX_OS_SIZE_OFFSET = 1;
const LDF_ADDRESS_OFFSET = 2;
const LDF_ENV_EXTENSION_COUNT_OFFSET = 3;
const LDCN_VALUE_OFFSET = 1;
const LDCB_VALUE_OFFSET = 1;

// printing opcodes for debugging

const OPCODES = list(
    pair(START,   "START  "),
    pair(LDCN,    "LDCN   "),
    pair(LDCB,    "LDCB   "),
    pair(LDCU,    "LDCU   "),
    pair(PLUS,    "PLUS   "),
    pair(MINUS,   "MINUS  "),
    pair(TIMES,   "TIMES  "),
    pair(EQUAL,   "EQUAL  "),
    pair(LESS,    "LESS   "),
    pair(GREATER, "GREATER"),
    pair(LEQ,     "LEQ    "),
    pair(GEQ,     "GEQ    "),
    pair(NOT,     "NOT    "),
    pair(DIV,     "DIV    "),
    pair(POP,     "POP    "),
    pair(ASSIGN,  "ASSIGN "),
    pair(JOF,     "JOF    "),
    pair(GOTO,    "GOTO   "),
    pair(LDF,     "LDF    "),
    pair(CALL,    "CALL   "),
    pair(LD,      "LD     "),
    pair(RTN,     "RTN    "),
    pair(DONE,    "DONE   "));
    
// get a the name of an opcode, for debugging

function get_name(op) {
    function lookup(opcodes) {
        return is_null(opcodes) ? error(op, "unknown opcode")
            : op === head(head(opcodes))
            ? tail(head(opcodes))
            : lookup(tail(opcodes));
    }
    return lookup(OPCODES);
}

// pretty-print the program

function print_program(P) {
    let i = 0;
    while (i < array_length(P)) {
        let s = stringify(i);
        const op = P[i];
        s = s + ": " + get_name(P[i]);
        i = i + 1;
        if (op === LDCN || op === LDCB || op === GOTO || 
            op === JOF || op === ASSIGN ||
            op === LDF || op === LD || op === CALL) {
            s = s + " " + stringify(P[i]);
            i = i + 1;
        } else {}
        if (op === LDF) {
            s = s + " " + stringify(P[i]) + " " +
                stringify(P[i + 1]);
            i = i + 2;
        } else {}
        display("", s);
    }
}

// COMPILER FROM SOURCE TO SVML

// parse given string and compile it to machine code
// return the machine code in an array

function parse_and_compile(string) {
    
    // machine_code is array for machine instructions
    const machine_code = [];
    
    // insert_pointer keeps track of the next free place
    // in machine_code
    let insert_pointer = 0;

    // three insert functions (nullary, unary, binary instructions)
    function add_nullary_instruction(op_code) {
        machine_code[insert_pointer] = op_code;
        insert_pointer = insert_pointer + 1;
    }
    // unary instructions have one argument (constant or address)
    function add_unary_instruction(op_code, arg_1) {
        machine_code[insert_pointer] = op_code;
        machine_code[insert_pointer + 1] = arg_1;
        insert_pointer = insert_pointer + 2;
    }
    // binary instructions have two arguments
    function add_binary_instruction(op_code, arg_1, arg_2) {
        machine_code[insert_pointer] = op_code;
        machine_code[insert_pointer + 1] = arg_1;
        machine_code[insert_pointer + 2] = arg_2;        
        insert_pointer = insert_pointer + 3;
    }
    // ternary instructions have three arguments
    function add_ternary_instruction(op_code, arg_1, arg_2, arg_3) {
        machine_code[insert_pointer] = op_code;
        machine_code[insert_pointer + 1] = arg_1;
        machine_code[insert_pointer + 2] = arg_2;   
        machine_code[insert_pointer + 3] = arg_3;    
        insert_pointer = insert_pointer + 4;
    }
        
    // to_compile stack keeps track of remaining compiler work:
    // these are function bodies that still need to be compiled
    let to_compile = null;
    function no_more_to_compile() {
        return is_null(to_compile);
    }
    function pop_to_compile() {
        const next = head(to_compile);
        to_compile = tail(to_compile);
        return next;
    }
    function push_to_compile(task) {
        to_compile = pair(task, to_compile);
    }
    
    // to compile a function body, we need an index table
    // to get the environment indices for each name
    // (parameters, globals and locals)
    // Each compile function returns the max operand stack
    // size needed for running the code. When compilation of 
    // a function body is done, the function continue_to_compile 
    // writes the max operand stack size and the address of the
    // function body to the given addresses.

    function make_to_compile_task(
                 function_body, max_stack_size_address, 
                 address_address, index_table) {
        return list(function_body, max_stack_size_address, 
                    address_address, index_table);
    }
    function to_compile_task_body(to_compile_task) {
        return list_ref(to_compile_task, 0);
    }
    function to_compile_task_max_stack_size_address(to_compile_task) {
        return list_ref(to_compile_task, 1);
    }
    function to_compile_task_address_address(to_compile_task) {
        return list_ref(to_compile_task, 2);
    }
    function to_compile_task_index_table(to_compile_task) {
        return list_ref(to_compile_task, 3);
    }

    // index_table keeps track of environment addresses
    // assigned to names
    function make_empty_index_table() {
        return null;
    }
    function extend_index_table(t, s) {
        return is_null(t) 
            ? list(pair(s, 0))
            : pair(pair(s, tail(head(t)) + 1), t);
    }
    function index_of(t, s) {
        return is_null(t)
            ? error(s, "name not found:")
            : head(head(t)) === s 
            ? tail(head(t))
            : index_of(tail(t), s);
    }

    // a small complication: the toplevel function
    // needs to return the value of the last statement
    let toplevel = true;
    
    function continue_to_compile() {
        while (! is_null(to_compile)) {
            const next_to_compile = pop_to_compile();
            const address_address = 
                      to_compile_task_address_address(next_to_compile);
            machine_code[address_address] = insert_pointer;
            const index_table = 
                      to_compile_task_index_table(next_to_compile);
            const max_stack_size_address =
                      to_compile_task_max_stack_size_address(
                          next_to_compile);
            const body = to_compile_task_body(next_to_compile);
            const max_stack_size =
                      compile(body, index_table, true);
            machine_code[max_stack_size_address] = 
                      max_stack_size;
            toplevel = false;
        }
    }
    
    function scan_out_declarations(component) {
        return is_sequence(component)
               ? accumulate(
                     append,
                     null,
                     map(scan_out_declarations,
                         sequence_statements(component)))
               : is_declaration(component)
               ? list(declaration_symbol(component))
               : null;
    }
    
    // compile_arguments compiles the arguments and
    // computes the maximal stack size needed for 
    // computing the arguments. Note that the arguments
    // themselves accumulate on the operand stack, which
    // explains the "i + compile(...)"
    function compile_arguments(exprs, index_table) {
        let i = 0;
        let s = length(exprs);
        let max_stack_size = 0;
        while (i < s) {
            max_stack_size = math_max(i + 
                                      compile(head(exprs), index_table, 
                                          false),
                                      max_stack_size);
            i = i + 1;
            exprs = tail(exprs);
        }
        return max_stack_size;
    }
    
    function compile_logical_composition(expr, index_table) {
        if (logical_composition_operator(expr) === "&&") {
            return compile(make_conditional_expression(
                                         first_operand(expr),
                                         second_operand(expr),
                                         make_literal(false)), 
                           index_table,
                           false);
        } else {
            return compile(make_conditional_expression(
                                         first_operand(expr),
                                         make_literal(true),
                                         second_operand(expr)),
                           index_table,
                           false);
        }
    }
    
    function compile_conditional_expression(expr, index_table, insert_flag) {
        const m_1 = compile(cond_expr_pred(expr), 
                            index_table, false);
        add_unary_instruction(JOF, NaN);
        const JOF_address_address = insert_pointer - 1;
        const m_2 = compile(cond_expr_cons(expr), 
                            index_table, insert_flag);
        let GOTO_address_address = NaN;
        if (!insert_flag) {
            add_unary_instruction(GOTO, NaN);
            GOTO_address_address = insert_pointer - 1;
        } else {}
        machine_code[JOF_address_address] = insert_pointer;
        const m_3 = compile(cond_expr_alt(expr), 
                            index_table, insert_flag);
        if (!insert_flag) {
            machine_code[GOTO_address_address] = insert_pointer;
        } else {}
        return math_max(m_1, m_2, m_3);
    }
    
    function compile_operator_combination(expr, index_table) {
        const op = operator_symbol(expr);
        const operand_1 = first_operand(expr);
        if (op === "!") {
            const max_stack_size = compile(operand_1, index_table, false);
            add_nullary_instruction(NOT);
            return max_stack_size;
        } else {
            const operand_2 = second_operand(expr);
            const op_code = op === "+" ? PLUS
                          : op === "-" ? MINUS
                          : op === "*" ? TIMES
                          : op === "/" ? DIV
                          : op === "===" ? EQUAL
                          : op === "<" ? LESS
                          : op === "<=" ? LEQ
                          : op === ">" ? GREATER
                          : op === ">=" ? GEQ
                          : error(op, "unknown operator:");
            const m_1 = compile(operand_1, index_table, false);
            const m_2 = compile(operand_2, index_table, false);
            add_nullary_instruction(op_code);
            return math_max(m_1, 1 + m_2);
        }
    }
            
    function compile_application(expr, index_table) {    
        const max_stack_operator = compile(function_expression(expr),
                                       index_table, false);
        const max_stack_operands = compile_arguments(arg_expressions(expr),
                                       index_table);
        add_unary_instruction(CALL, length(arg_expressions(expr)));
        return math_max(max_stack_operator, max_stack_operands + 1);
    }
    
    function compile_lambda_expression(expr, index_table) {
        const the_body = lambda_body(expr);
        const body = is_block(the_body) ? block_body(the_body) : the_body;
        const locals = scan_out_declarations(body);
        const parameters = lambda_parameter_symbols(expr);
        const extended_index_table =
            accumulate((s, it) => extend_index_table(it, s),
                       index_table,
                       append(reverse(locals), 
                              reverse(parameters)));
        add_ternary_instruction(LDF, NaN, NaN, 
                               length(parameters) + length(locals));
        const max_stack_size_address = insert_pointer - 3;
        const address_address = insert_pointer - 2;
        push_to_compile(make_to_compile_task(
                            body, max_stack_size_address, 
                            address_address, extended_index_table));
        return 1;
    }
    
    function compile_sequence(expr, index_table, insert_flag) {
        const statements = sequence_statements(expr);
        if (is_empty_sequence(statements)) {
            return 0;
        } else if (is_last_statement(statements)) {
            return compile(first_statement(statements), 
                           index_table, insert_flag);
        } else {
            const m_1 = compile(first_statement(statements), 
                                index_table, false);
            add_nullary_instruction(POP);
            const m_2 = compile(make_sequence(rest_statements(statements)), 
                                index_table, insert_flag);
            return math_max(m_1, m_2);
        }
    }
    
    function compile_constant_declaration(expr, index_table) {
        const name = declaration_symbol(expr);
        const index = index_of(index_table, name);
        const max_stack_size = compile(constant_declaration_value(expr),
                                 index_table, false);
        add_unary_instruction(ASSIGN, index);
        add_nullary_instruction(LDCU);
        return max_stack_size;
    }
    
    function compile(expr, index_table, insert_flag) {
        let max_stack_size = 0;
        if (is_literal(expr)) {
            if (is_number(literal_value(expr))) {
                add_unary_instruction(LDCN, literal_value(expr));
                max_stack_size = 1;
            } else if (is_boolean(literal_value(expr))) {
                add_unary_instruction(LDCB, literal_value(expr));
                max_stack_size = 1;
            } else {
                error(expr, "unknown literal:");
            }
        } else if (is_undefined_expression(expr)) {
            add_nullary_instruction(LDCU);  
            max_stack_size = 1;
        } else if (is_logical_composition(expr)) {
            max_stack_size = 
            compile_logical_composition(expr, index_table);
        } else if (is_conditional_expression(expr)) {
            max_stack_size = 
            compile_conditional_expression(expr, index_table, insert_flag);
            insert_flag = false;
        } else if (is_operator_combination(expr)) {
            max_stack_size = 
            compile_operator_combination(expr, index_table);
        } else if (is_application(expr)) {
            max_stack_size = 
            compile_application(expr, index_table);
        } else if (is_lambda_expression(expr)) {
            max_stack_size =
            compile_lambda_expression(expr, index_table);
        } else if (is_name(expr)) {
            add_unary_instruction(LD, index_of(index_table, 
                                  symbol_of_name(expr)));
            max_stack_size = 1;
        } else if (is_sequence(expr)) {
            max_stack_size =
            compile_sequence(expr, index_table, insert_flag);
            insert_flag = false;
        } else if (is_constant_declaration(expr)) {
            max_stack_size =
            compile_constant_declaration(expr, index_table);
        } else if (is_function_declaration(expr)) {
            max_stack_size =
            compile(function_decl_to_constant_decl(expr),
                    index_table, insert_flag);
        } else if (is_return_statement(expr)) {
            max_stack_size = compile(return_statement_expression(expr), 
                                     index_table, false);
        } else {
            error(expr, "unknown expression:");
        }
        
        // handling of return
        if (insert_flag) {
            if (is_return_statement(expr)) {
                add_nullary_instruction(RTN);
            } else if (toplevel && 
                       (is_literal(expr) ||
                        is_undefined_expression(expr) ||
                        is_application(expr) ||
                        is_operator_combination(expr))
                      ) {
                add_nullary_instruction(RTN);
            } else {
                add_nullary_instruction(LDCU);
                max_stack_size = max_stack_size + 1;
                add_nullary_instruction(RTN);
            } 
        } else {}
        return max_stack_size;
    }
    
    const program = parse(string);
    add_nullary_instruction(START);
    add_ternary_instruction(LDF, NaN, NaN, 
                            length(scan_out_declarations(program)));
    const LDF_max_stack_size_address = insert_pointer - 3;
    const LDF_address_address = insert_pointer - 2;
    add_unary_instruction(CALL, 0);
    add_nullary_instruction(DONE);
    
    const locals = reverse(scan_out_declarations(program)); 
    const program_names_index_table =
         accumulate((s, it) => extend_index_table(it, s),
                    make_empty_index_table(),
                    locals);
    
    push_to_compile(make_to_compile_task(
                        program, 
                        LDF_max_stack_size_address, 
                        LDF_address_address, 
                        program_names_index_table));
    continue_to_compile();
    return machine_code;
}

// VIRTUAL MACHINE

// "registers" are the global variables of our machine. 
// These contain primitive values (numbers or boolean 
// values) or arrays of primitive values

// P is an array that contains an SVML machine program: 
// the op-codes of instructions and their arguments
let P = [];
// PC is program counter: index of the next instruction
let PC = 0;
// HEAP is array containing all dynamically allocated data structures
let ENV = -Infinity;
// OS is address of current operand stack in HEAP; initially a dummy value
let OS = -Infinity;
// temporary value, used by PUSH and POP; initially a dummy value
let RES = -Infinity;   

// RTS: runtime stack
let RTS = [];
let TOP_RTS = -1;

// boolean that says whether machine is running
let RUNNING = NaN;

// exit state: NORMAL, DIV_ERROR, OUT_OF_MEMORY_ERROR, etc
let STATE = NaN;

// //////////////////////////////
// some general-purpose registers
// //////////////////////////////

let A = 0;
let B = 0;
let C = 0;
let D = 0;
let E = 0;
let F = 0;
let G = 0;
let H = 0;
let I = 0;
let J = 0;
let K = 0;
let L = 0;
let N = 0;
let O = 0;
let Q = 0;
let R = 0;

function show_executing(s) {
    display("", "--- RUN ---" + s);
    display( PC, "PC :");
    display( get_name(P[PC]), "instr:");
}

// for debugging: show all registers
function show_registers(s) {
    show_executing(s);
    display("", "--- REGISTERS ---");
    display(RES, "RES:");
    display(  A, "A  :");
    display(  B, "B  :");
    display(  C, "C  :");
    display(  D, "D  :");
    display(  E, "E  :");
    display(  F, "F  :");
    display(  G, "G  :");
    display(  H, "H  :");
    display(  I, "I  :");
    display(  J, "J  :");
    display(  K, "K  :");
    display(  L, "L  :");
    display(  N, "N  :");
    display( OS, "OS :");
    display(ENV, "ENV:");
    display(RTS, "RTS:");
    display(TOP_RTS, "TOP_RTS:");
}

// HEAP is array containing all dynamically allocated data structures
let HEAP = NaN;
// next free slot in heap
let FREE = -Infinity;
// the size of the heap is fixed
let HEAP_SIZE = -Infinity;
// temporary root
let TEMP_ROOT = -Infinity;
// active half-space
let TO_SPACE = -Infinity;
// free half-space
let FROM_SPACE = -Infinity;
// Size of half-space
let SPACE_SIZE = -Infinity;
// End of To-Space
let TOP_OF_SPACE = -Infinity;


// general node layout
const TAG_SLOT = 0;
const SIZE_SLOT = 1;
const FIRST_CHILD_SLOT = 2;
const LAST_CHILD_SLOT = 3;

// Idea: Use the tag slot to store the forwarding address
// Legit Tags are negative, forwarding addresses are non-negative
const FORWARDING_ADDRESS = 0;	

// ///////////////////////////////////
// MEMORY MANAGEMENT
// ///////////////////////////////////

function initialize_machine(heapsize) {
    display(heapsize, "\nRunning VM with heap size:");
    HEAP = [];
    HEAP_SIZE = heapsize;
    TO_SPACE = 0;
    SPACE_SIZE = HEAP_SIZE / 2;
    TOP_OF_SPACE = TO_SPACE + SPACE_SIZE - 1;
    FROM_SPACE = TOP_OF_SPACE + 1;
    FREE = TO_SPACE;
    RUNNING = true;
    STATE = NORMAL;
    PC = 0;
    initialize_memory(heapsize);
    initialise_tag([NUMBER_TAG, BOOL_TAG, UNDEFINED_TAG, OS_TAG, CLOSURE_TAG, RTS_FRAME_TAG, ENV_TAG],
        ["NUMBER", "BOOL", "UNDEFINED", "OS", "CLOSURE", "RTS_FRAME", "ENV"]);
}

function move(from_addr, to_addr) {
    ///display("moving from " + stringify(from_addr) + " to " + stringify(to_addr));
    for (K = 0; K < HEAP[from_addr + SIZE_SLOT]; K = K + 1) {
        HEAP[K + to_addr] = HEAP[from_addr + K];
        //display("HEAP[" + stringify(152) + "] : " + stringify(HEAP[152]));
    }
}

function already_copied(idx) {
    RES = HEAP[idx + FORWARDING_ADDRESS] >= 0;
}

function copy(idx) {
    // display(idx);
    already_copied(idx);
    //display(stringify(idx) + "  " + stringify(RES));
    if (RES) {
        RES = HEAP[idx + FORWARDING_ADDRESS];
    } else {
        R = FREE;
        
        move(idx, FREE);
        newCopy(idx, FREE, HEAP);
        FREE = FREE + HEAP[idx + SIZE_SLOT];
        HEAP[idx + FORWARDING_ADDRESS] = R;
        RES = R;
    }
    // display("Free is " + stringify(FREE));
}

function flip() {
    display("flipping!");
    // show_heap("before");
    //show_registers("before");
    startFlip(TO_SPACE, FROM_SPACE, HEAP);
    K = TO_SPACE;
    TO_SPACE = FROM_SPACE;
    FROM_SPACE = K;
    TOP_OF_SPACE = TO_SPACE + SPACE_SIZE - 1;
    FREE = TO_SPACE;
    copy(ENV); ENV = RES;
    copy(OS); OS = RES;
    if (TEMP_ROOT >= 0) {
        copy(TEMP_ROOT); TEMP_ROOT = RES;
    } else {}
    
    for (O = 0; O <= TOP_RTS; O = O + 1) {
        //display(RTS[O]);
        copy(RTS[O]); RTS[O] = RES;
    }
    I = TO_SPACE;

    while (I < FREE) {
        scanFlip(I, FREE, HEAP[I + HEAP[I + FIRST_CHILD_SLOT]], HEAP[I + HEAP[I + LAST_CHILD_SLOT]], HEAP);
        for (O = HEAP[I + FIRST_CHILD_SLOT]; O <= HEAP[I + LAST_CHILD_SLOT]; O = O + 1) {
            // display("I is " + stringify(I));
            // display("O is " + stringify(O));
            copy(HEAP[I + O]);
            HEAP[I + O] = RES;
        }
        I = I + HEAP[I + SIZE_SLOT];
    }
    display("Flip finished!");
    
    newFlip(FREE, HEAP);
    HEAP = resetToSpace(FROM_SPACE, HEAP);
    
}

// NEW expects tag in A and size in B
// changes A, B, C, D, J, K
function NEW() {
    J = A;
    Q = B;
    if (FREE + Q > TOP_OF_SPACE) {
        flip();
    } else {}
    if (FREE + Q > TOP_OF_SPACE) {
       STATE = OUT_OF_MEMORY_ERROR;
       display("OUT_OF_MEMORY_ERROR");
       RUNNING = false;
	} else {}
    HEAP[FREE + TAG_SLOT] = J;
    HEAP[FREE + SIZE_SLOT] = Q;
    newNew(FREE, HEAP);
    RES = FREE;
    FREE = FREE + Q;
}

// machine states                 

const NORMAL = 0;
const DIV_ERROR = 1;
const OUT_OF_MEMORY_ERROR = 2; 

// number nodes layout
//
// 0: tag  = -100
// 1: size = 5
// 2: offset of first child from the tag: 6 (no children)
// 3: offset of last child from the tag: 5 (must be less than first)
// 4: value

const NUMBER_TAG = -100;
const NUMBER_SIZE = 5;
const NUMBER_VALUE_SLOT = 4;

// expects number in A
// changes A, B, C, D, E, J, K
function NEW_NUMBER() {
    E = A;
    A = NUMBER_TAG;
    B = NUMBER_SIZE;
    NEW();
    HEAP[RES + FIRST_CHILD_SLOT] = 6;
    HEAP[RES + LAST_CHILD_SLOT] = 5; // no children
    HEAP[RES + NUMBER_VALUE_SLOT] = E;
}

// bool nodes layout
//
// 0: tag  = -101
// 1: size = 5
// 2: offset of first child from the tag: 6 (no children)
// 3: offset of last child from the tag: 5 (must be less than first)
// 4: value

const BOOL_TAG = -101;
const BOOL_SIZE = 5;
const BOOL_VALUE_SLOT = 4;

// expects boolean in A
// changes A, B, C, D, E, J, K
function NEW_BOOL() {
    E = A;
    A = BOOL_TAG;
    B = BOOL_SIZE;
    NEW();
    HEAP[RES + FIRST_CHILD_SLOT] = 6;
    HEAP[RES + LAST_CHILD_SLOT] = 5; // no children
    HEAP[RES + BOOL_VALUE_SLOT] = E;
}

// undefined nodes layout
//
// 0: tag  = -106
// 1: size = 4
// 2: offset of first child from the tag: 5 (no children)
// 3: offset of last child from the tag: 4 (must be less than first)

const UNDEFINED_TAG = -106;
const UNDEFINED_SIZE = 4;

// changes A, B, C, D, J, K
function NEW_UNDEFINED() {
    A = UNDEFINED_TAG;
    B = UNDEFINED_SIZE;
    NEW();
    HEAP[RES + FIRST_CHILD_SLOT] = 5;
    HEAP[RES + LAST_CHILD_SLOT] = 4; // no children
}

// operandstack nodes layout
//
// 0: tag  = -105
// 1: size = maximal number of entries + 4
// 2: first child slot = 4
// 3: last child slot = current top of stack; initially 3 (empty stack)
// 4: first entry
// 5: second entry
// ...

const OS_TAG = -105;

// expects max size in A
// changes A, B, C, D, E, J, K
function NEW_OS() {
    E = A;
    A = OS_TAG;
    B = E + 4;
    NEW();
	HEAP[RES + FIRST_CHILD_SLOT] = 4;
	// operand stack initially empty
	HEAP[RES + LAST_CHILD_SLOT] = 3;
}

// PUSH and POP are convenient subroutines that operate on
// the operand stack OS

// expects its argument in A
// changes A, B
function PUSH_OS() {
    B = HEAP[OS + LAST_CHILD_SLOT]; // address of current top of OS
    B = B + 1; 
    HEAP[OS + LAST_CHILD_SLOT] = B; // update address of current top of OS
    HEAP[OS + B] = A;
    newPush(OS + LAST_CHILD_SLOT, OS+B, HEAP);
}

// POP puts the top-most value into RES
// changes B
function POP_OS() {
    B = HEAP[OS + LAST_CHILD_SLOT]; // address of current top of OS
    HEAP[OS + LAST_CHILD_SLOT] = B - 1; // update address of current top of OS
    RES = HEAP[OS + B];
    newPop(RES, OS+B, OS+LAST_CHILD_SLOT, HEAP);
}

// closure nodes layout
//
// 0: tag  = -103
// 1: size = 8
// 2: offset of first child from the tag: 6 (only environment)
// 3: offset of last child from the tag: 6
// 4: stack size = max stack size needed for executing function body
// 5: address = address of function
// 6: environment
// 7: extension count = number of entries by which to extend env

const CLOSURE_TAG = -103;
const CLOSURE_SIZE = 8;
const CLOSURE_OS_SIZE_SLOT = 4;
const CLOSURE_ADDRESS_SLOT = 5;
const CLOSURE_ENV_SLOT = 6;
const CLOSURE_ENV_EXTENSION_COUNT_SLOT = 7;

// expects stack size in A, P address in B, environment extension count in C
// changes A, B, C, D, E, F, J, K
function NEW_CLOSURE() {
    D = A;
    E = B;
    F = C;
    A = CLOSURE_TAG;
    B = CLOSURE_SIZE;
    NEW();
	HEAP[RES + FIRST_CHILD_SLOT] = CLOSURE_ENV_SLOT;
	HEAP[RES + LAST_CHILD_SLOT] = CLOSURE_ENV_SLOT;
	HEAP[RES + CLOSURE_OS_SIZE_SLOT] = D;
	HEAP[RES + CLOSURE_ADDRESS_SLOT] = E;
    HEAP[RES + CLOSURE_ENV_SLOT] = ENV;
    HEAP[RES + CLOSURE_ENV_EXTENSION_COUNT_SLOT] = F;
}

// expects closure in A, environment in B
function SET_CLOSURE_ENV() {
    HEAP[A + CLOSURE_ENV_SLOT] = B;
}

// stackframe nodes layout
//
// 0: tag  = -104
// 1: size = 7
// 2: offset of first child from the tag: 5 (environment)
// 3: offset of last child from the tag: 6 (operand stack)
// 4: program counter = return address
// 5: environment
// 6: operand stack

const RTS_FRAME_TAG = -104;
const RTS_FRAME_SIZE = 7;
const RTS_FRAME_PC_SLOT = 4;
const RTS_FRAME_ENV_SLOT = 5;
const RTS_FRAME_OS_SLOT = 6;

// expects current PC, ENV, OS in their registers
// changes A, B, C, D, J, K
function NEW_RTS_FRAME() {
    A = RTS_FRAME_TAG;
    B = RTS_FRAME_SIZE;
    NEW();
	HEAP[RES + FIRST_CHILD_SLOT] = RTS_FRAME_ENV_SLOT;
	HEAP[RES + LAST_CHILD_SLOT] = RTS_FRAME_OS_SLOT;
	HEAP[RES + RTS_FRAME_PC_SLOT] = PC + 2; // next instruction!
	HEAP[RES + RTS_FRAME_ENV_SLOT] = ENV;
    HEAP[RES + RTS_FRAME_OS_SLOT] = OS;
}

// expects stack frame in A
function PUSH_RTS() {
    TOP_RTS = TOP_RTS + 1;
    RTS[TOP_RTS] = A;
}

// places stack frame into RES
function POP_RTS() {
    RES = RTS[TOP_RTS];
    TOP_RTS = TOP_RTS - 1;
}

// environment nodes layout
//
// 0: tag  = -102
// 1: size = number of entries + 4
// 2: first child = 4
// 3: last child 
// 4: first entry
// 5: second entry
// ...

const ENV_TAG = -102;

// expects number of env entries in A
// changes A, B, C, D, J, K
function NEW_ENVIRONMENT() {
    D = A;
    A = ENV_TAG;
    B = D + 4;
    NEW();
    HEAP[RES + FIRST_CHILD_SLOT] = 4;
    HEAP[RES + LAST_CHILD_SLOT] = 3 + D;
}

// expects env in A, by-how-many in B
// changes A, B, C, D
// Using TEMP_ROOT to make sure the
// origin on copying is updated when 
// garbage collection happens in NEW_ENVIRONMENT
function  EXTEND() {
    TEMP_ROOT = A;
    A = HEAP[A + SIZE_SLOT] - 4 + B;
    NEW_ENVIRONMENT();
    E = RES;
    for (B = HEAP[TEMP_ROOT + FIRST_CHILD_SLOT]; 
         B <= HEAP[TEMP_ROOT + LAST_CHILD_SLOT];
         B = B + 1) {
        already_copied(HEAP[TEMP_ROOT + B]);
        if (RES) {
            HEAP[E + B] = HEAP[HEAP[TEMP_ROOT + B] + FORWARDING_ADDRESS];   
        } else {
            HEAP[E + B] = HEAP[TEMP_ROOT + B];
        }
    }
    RES = E;
    TEMP_ROOT = -1;
}

// debugging: show current heap
function is_node_tag(x) {
    return x !== undefined && x <= -100 && x >= -110;
}
function node_kind(x) {
    return x ===      NUMBER_TAG ? "number"
         : x ===        BOOL_TAG ? "bool"
         : x ===     CLOSURE_TAG ? "closure"
         : x ===   RTS_FRAME_TAG ? "RTS frame"
         : x ===          OS_TAG ? "OS"
         : x ===         ENV_TAG ? "environment"
         : x ===   UNDEFINED_TAG ? "undefined"
         : " (unknown node kind)";
}
function show_heap(s) {
    const len = array_length(HEAP);
    let i = 0;
    display("", "--- HEAP --- " + s);
    while (i < len) {
        display("", stringify(i) + ": " + stringify(HEAP[i]) +
                    (is_number(HEAP[i]) && is_node_tag(HEAP[i]) 
                     ? " ("+node_kind(HEAP[i])+")" 
                     : ""));
        i = i + 1;
    }
}

function show_heap_value(address) {
    display("", "result: heap node of type = " + 
                node_kind(HEAP[address]) +
                ", value = " + 
                stringify(HEAP[address + NUMBER_VALUE_SLOT]));
    
}

// SVMLa implementation

// We implement our machine with an array M that
// contains subroutines. Each subroutine implements
// a machine instruction, using a nullary function. 
// The machine can then index into M using the op-codes
// of the machine instructions. To be implementable on
// common hardware, the subroutines have the 
// following structure:
// * they have no parameters
// * they do not return any results
// * they do not have local variables
// * they do not call other functions except the 
//   subroutines PUSH and POP
// * each line is very simple, for example an array access
// Ideally, each line can be implemented directly with a
// machine instruction of a real computer. In that case,
// the subroutines could become machine language macros, 
// and the compiler could generate real machine code.

const M = [];

M[START] = () =>   { A = 1; // first OS only needs to hold one closure
                     NEW_OS();
                     OS = RES;
                     A = 0; // first environment is empty
                     NEW_ENVIRONMENT();
                     ENV = RES;
                     PC = PC + 1;
                   };

M[LDCN] = () =>    { A = P[PC + LDCN_VALUE_OFFSET];
                     NEW_NUMBER();
                     A = RES;
                     PUSH_OS();
                     PC = PC + 2;
                   };

M[LDCB] = () =>    { A = P[PC + LDCB_VALUE_OFFSET]; 
                     NEW_BOOL();
                     A = RES;
                     PUSH_OS();
                     PC = PC + 2;
                   };

M[LDCU] = () =>    { NEW_UNDEFINED();
                     A = RES;
                     PUSH_OS();
                     PC = PC + 1;
                   };
                   
M[PLUS] = () =>    { POP_OS();
                     A = HEAP[RES + NUMBER_VALUE_SLOT];
                     POP_OS();
                     A = HEAP[RES + NUMBER_VALUE_SLOT] + A;
                     NEW_NUMBER();
                     A = RES;
                     PUSH_OS();
                     PC = PC + 1;
                   };

M[MINUS] = () =>   { POP_OS();
                     A = HEAP[RES + NUMBER_VALUE_SLOT];
                     POP_OS();
                     A = HEAP[RES + NUMBER_VALUE_SLOT] - A;
                     NEW_NUMBER();
                     A = RES;
                     PUSH_OS();
                     PC = PC + 1;
                   };

M[TIMES] = () =>   { POP_OS();
                     A = HEAP[RES + NUMBER_VALUE_SLOT];
                     POP_OS();
                     A = HEAP[RES + NUMBER_VALUE_SLOT] * A;
                     NEW_NUMBER();
                     A = RES;
                     PUSH_OS();
                     PC = PC + 1;
                   };
     
M[EQUAL] = () =>   { POP_OS();
                     //display("RES is " + stringify(RES));
                     A = HEAP[RES + NUMBER_VALUE_SLOT];
                     POP_OS();
                     //display("RES is " + stringify(RES));
                     A = HEAP[RES + NUMBER_VALUE_SLOT] === A;
                     NEW_BOOL();
                     A = RES;
                     PUSH_OS();
                     PC = PC + 1;
                   };
         
M[LESS] = () =>    { POP_OS();
                     A = HEAP[RES + NUMBER_VALUE_SLOT];
                     POP_OS();
                     A = HEAP[RES + NUMBER_VALUE_SLOT] < A;
                     NEW_BOOL();
                     A = RES;
                     PUSH_OS();
                     PC = PC + 1;
                   };
     
M[GEQ] = () =>     { POP_OS();
                     A = HEAP[RES + NUMBER_VALUE_SLOT];
                     POP_OS();
                     A = HEAP[RES + NUMBER_VALUE_SLOT] >= A;
                     NEW_BOOL();
                     A = RES;
                     PUSH_OS();
                     PC = PC + 1;
                   };

M[LEQ] = () =>     { POP_OS();
                     A = HEAP[RES + NUMBER_VALUE_SLOT];
                     POP_OS();
                     A = HEAP[RES + NUMBER_VALUE_SLOT] <= A;
                     NEW_BOOL();
                     A = RES;
                     PUSH_OS();
                     PC = PC + 1;
                   };
     
M[GREATER] = () => { POP_OS();
                     A = HEAP[RES + NUMBER_VALUE_SLOT];
                     POP_OS();
                     A = HEAP[RES + NUMBER_VALUE_SLOT] > A;
                     NEW_BOOL();
                     A = RES;
                     PUSH_OS();
                     PC = PC + 1;
                   };

M[NOT] = () =>     { POP_OS();
                     A = ! HEAP[RES + BOOL_VALUE_SLOT];
                     NEW_BOOL();
                     A = RES;
                     PUSH_OS();
                     PC = PC + 1;
                   };

M[DIV] = () =>     { POP_OS();
                     A = HEAP[RES + NUMBER_VALUE_SLOT];
                     E = A;
                     POP_OS();
                     A = HEAP[RES + NUMBER_VALUE_SLOT] / A;
                     NEW_NUMBER();
                     A = RES;
                     PUSH_OS();
                     PC = PC + 1;
                     E = E === 0;
                     if (E) { 
                         STATE = DIV_ERROR; 
                         RUNNING = false;
                     } else {}
                   };
                   
M[POP] = () =>     { POP_OS();
                     PC = PC + 1;
                   };
                   
M[ASSIGN] = () =>  { POP_OS();
                     HEAP[ENV + HEAP[ENV + FIRST_CHILD_SLOT] 
                              + P[PC + 1]] = RES;
                    newAssign(RES, ENV + HEAP[ENV + FIRST_CHILD_SLOT] 
                              + P[PC + 1], HEAP);
                     PC = PC + 2;
                    
                   };
                   
M[JOF] = () =>     { POP_OS();
                     A = HEAP[RES + NUMBER_VALUE_SLOT];
                     if (!A) { PC = P[PC + 1]; } else {}
                     if (A) { PC = PC + 2; } else {}
                   };

M[GOTO] = () =>    { PC = P[PC + 1]; 
                   };

M[LDF] = () =>     { A = P[PC + LDF_MAX_OS_SIZE_OFFSET];
                     B = P[PC + LDF_ADDRESS_OFFSET];
                     C = P[PC + LDF_ENV_EXTENSION_COUNT_OFFSET];
                     NEW_CLOSURE();
                     A = RES;
                     PUSH_OS();
                     PC = PC + 4;
                   };

M[LD] = () =>      { A = HEAP[ENV + HEAP[ENV + FIRST_CHILD_SLOT] 
                                  + P[PC + 1]];
                     PUSH_OS();
                     PC = PC + 2;
                   };
                   
M[CALL] = () =>    { G = P[PC + 1];  // lets keep number of arguments in G
                     // we peek down OS to get the closure
                     F = HEAP[OS + HEAP[OS + LAST_CHILD_SLOT] - G]; 
                     // prep for EXTEND
                     A = HEAP[F + CLOSURE_ENV_SLOT];
                     // A is now env to be extended
                     H = HEAP[A + LAST_CHILD_SLOT]; 
                     // H is now offset of last child slot
                     B = HEAP[F + CLOSURE_ENV_EXTENSION_COUNT_SLOT];
                     // B is now the environment extension count      
                     L = HEAP[F + CLOSURE_ADDRESS_SLOT];
                     N = HEAP[F + CLOSURE_OS_SIZE_SLOT]; // closure stack size

                     EXTEND(); // after this, RES is new env
                     
                     // Heap address of new environment can 
                     // be changed by NEW_RS_FRAME and NEW_OS below.
                     // Assigning TEMP_ROOT to address makes sure we
                     // restore the updated value before competing CALL.
                     TEMP_ROOT = RES;
                     
                     H = RES + H + G; 
                     // H is now address where last argument goes in new env
                     for (C = H; C > H - G; C = C - 1) {
                         POP_OS(); // now RES has the address of the next arg
                         HEAP[C] = RES; // copy argument into new env
                     }
                     POP_OS(); // closure is on top of OS; pop; no more needed
                     NEW_RTS_FRAME(); // saves PC + 2, ENV, OS 
                     A = RES;
                     PUSH_RTS();
                     A = N;
                     NEW_OS();    
                     OS = RES;
                     PC = L;
                     ENV = TEMP_ROOT;
                     TEMP_ROOT = -1;
                   };
                   
M[RTN] = () =>     { POP_RTS();
                     H = RES;
                     PC = HEAP[H + RTS_FRAME_PC_SLOT];
                     ENV = HEAP[H + RTS_FRAME_ENV_SLOT];
                     POP_OS();
                     A = RES;
                     OS = HEAP[H + RTS_FRAME_OS_SLOT];
                     PUSH_OS();
                    };

M[DONE] = () =>    { RUNNING = false;
                   };
                   
function run() {
    while (RUNNING) { 
        //show_executing("!");
        if (M[P[PC]] === undefined) {
            error(P[PC], "unknown op-code:");
        } else {
            M[P[PC]](); 
        }
    } 
    if (STATE === DIV_ERROR) {
        POP_OS();
        error(RES, "execution aborted:");
    } else if (STATE ===  OUT_OF_MEMORY_ERROR) {
        error(RES, "memory exhausted");
    } else {
        POP_OS();
        show_heap_value(RES); 
    }
}

initialize_machine(240);
//updateMemoryHeap([1,3,4,5,64,3,5]);

P = parse_and_compile("         \
function factorial(n) {         \
    return n === 1 ? 1          \
        : n * factorial(n - 1); \
}                               \
factorial(3);                   ");
run();

//updateMemoryHeap([1,2,3,4,2,4,NUMBER_TAG,5]);
init();
