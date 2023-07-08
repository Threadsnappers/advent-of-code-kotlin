---
title: Day 5 - Supply Stacks 🏗️
description: A solution to day 5 
template: doc
---

The Elves need to rearrange their supply crates using a large cargo crane 
but they forgot to ask the crane operator where each crate will end up.
Our task is to find out which crate ends up at the top of each stack of crates.

## Analysing the input

Let's take a look at the sample input.
```
    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2
```

The input can be divided into two parts. The first part represents the initial
configuration of the stacks with each letter representing a crate. 

The second part is the set of instructions which will be followed by the crane
operator. The first number denotes the number of crates will be moved. The
second and third numbers tell us where to take the stacks from and where they have
to be moved to.

As usual, the input will be read using the `readInput` function provided
in the Kotlin AoC template.

## Part 1

We need to find which crates would end up at the top of each stack after
rearranging the crates as per the instructions and combine those letters
to a string to get the solution of part 1. The first step is to process the
stacks into a data structure.

### [`Stack`]()ing Up The Crates

To start the process, we'll use the [`indexOf`]() function to find the index of
the empty line which separates the stack data and the instructions. Decreasing
it by one gives us the line which contains the column labels of the stacks.
The last number in that line will tell us the total number of stacks to be
modelled. Let's call the index of this line `stackLabelIndex`.

```kotlin
val stackLabelIndex = input.indexOf("") - 1
```

#### Finding the number of stacks

The last number in the list of stack labels will give us the total number of stacks.
To remove the leading and trailing spaces we can begin the call with the [`trim`]()
function. Then the last number can be extracted by using [`substringAfterLast`]()
before calling [`toInt()`]().

```kotlin
input[stackLabelIndex].trim().substringAfterLast(" ").toInt()  // Total number of stacks
```


#### Adding Crates to The Stacks

For storing the stacks we shall be creating a mutable list of `Stack<Char>` called `stacks`.
We shall be using [`lateinit`]() because we won't be assigning values to it right now.
```kotlin
lateinit var stacks: MutableList<Stack<Char>>
```

Now we can start populating our list of stacks. To make the process more simple, we will start
reading the stack data from bottom to top using a for loop which iterates indices `i` from 
`stackLabelIndex - 1` which has the first level of crates to 0. Then the current line can be
accessed using `input[i]`. 

The crate letters always start at 1 and are separated by 4 chars. An inner loop
whcih runs from 1 to the length of the line with a step of 4 can be made to iterate over the
crates. The input always has enough spaces to fill the empty gaps in case the last stack
doesn't have items at the top. `line[j]` will be the character at that position. As long as it
isn't a space that contains a crate letter. If it is the crate letter then we push it into the
stack. 

The stack at first stack of letters appears at index 1, second at index 5, third at 9 and so on.
Which means the location of the stack in the `stacks` list should be `index - 1 / 4`. The end 
result is this.

```kotlin
for (i in stackLabelIndex - 1 downTo 0) {
    val line = input[i]
    for (j in 1..line.length step 4) {
        if (line[j] != ' ') {
            stacks[(j - 1) / 4].push(line[j])
        }
    }
}
```
Let's enclose this part in a function called `buildStacks()` so that we can reuse it for part 2.
```kotlin
fun buildStacks() {
    stacks = MutableList(input[stackLabelIndex].trim().substringAfterLast(" ").toInt()) { Stack<Char>() }
    for (i in stackLabelIndex - 1 downTo 0) {
        val line = input[i]
        for (j in 1..line.length step 4) {
            if (line[j] != ' ') {
                stacks[(j - 1) / 4].push(line[j])
            }
        }
    }
}
```

### Executing the Instructions

Let's start moving the crates! Every line which specifies movement of crates starts with the word
`"move"`. After filtering the command list, we can take a look at the format of the numbers on each
command. The first number specifies number of crates to be moved, second number denotes which stack 
we have to take crates from and third shows the destination of the crates being moved.

For this we can split each line around space and then convert all the tokens to `Int?` using
`toIntOrNull()`. For words this will return null which will be filtered out in the next step.
All that's left in the list now are the three numbers.

```kotlin
input.filter { it.startsWith("move") }
    .forEach { l ->
        l.split(" ")
            .filter { it.toIntOrNull() != null }
            .map { it.toInt() }
    }
```

Using the `let` scope function we can process the elements of the resulting list. We can call it
`array`. Let's create a variable `stack` for storing the stack of items which have to be moved.
The second number (`array[1]`) of the array denotes where we should be taking the crates from. Since 1st stack
means index 0, we shall be popping elements out of the stack at `array[1] - 1` and pushing them into
the temporary `stack`. We'll be repeating this `array[0]` times to pop and push enough elements into the `stack` 

All that's left is to add all the elements in the temporary `stack` to the destination which is
`stacks[array[2] - 1]`.
```kotlin
input.filter { it.startsWith("move") }
    .forEach { l ->
        l.split(" ")
            .filter { it.toIntOrNull() != null }
            .map { it.toInt() }
            .let { array -> // Number of crates, origin, destination
                val stack = mutableListOf<Char>()
                repeat(array[0]) {
                    stack.add(stacks[array[1] - 1].pop())
                }

                stacks[array[2] - 1].addAll(stack)
            }
    }
```

### Grouping the Top Stacks Together

We can extract the result string by using the [`joinToString()`]() function.
```kotlin
stacks.joinToString(transform = { it.last().toString() }, separator = "")
```

Finally, so that this segment can be reused for part 2 let's wrap this in a function.
```kotlin
 fun applyOperations(moveMultipleAtOnce: Boolean): String {
    input.filter { it.startsWith("move") }
        .forEach { l ->
            l.split(" ")
                .filter { it.toIntOrNull() != null }
                .map { it.toInt() }
                .let { array -> // Number of crates, origin, destination
                    val stack = mutableListOf<Char>()
                    repeat(array[0]) {
                        stack.add(stacks[array[1] - 1].pop())
                    }

                    stacks[array[2] - 1].addAll(stack)
                }
        }
    return stacks.joinToString(transform = { it.last().toString() }, separator = "")
}
```

### Computing the Result

Just calling the functions in order is enough to reach the solution.
```kotlin
buildStacks()
val part1 = applyOperations()
```

### Solution

```kotlin
val input = readInput("Day05")
val stackLabelIndex = input.indexOf("") - 1
lateinit var stacks: MutableList<Stack<Char>>
fun buildStacks() {
    stacks = MutableList(input[stackLabelIndex].trim().substringAfterLast(" ").toInt()) { Stack<Char>() }
    for (i in stackLabelIndex - 1 downTo 0) {
        val line = input[i]
        for (j in 1..line.length step 4) {
            if (line[j] != ' ') {
                stacks[(j - 1) / 4].push(line[j])
            }
        }
    }
}

fun applyOperations(): String {
    input.filter { it.startsWith("move") }
        .forEach { l ->
            l.split(" ")
                .filter { it.toIntOrNull() != null }
                .map { it.toInt() }
                .let { array -> // Number of crates, origin, destination
                    val stack = mutableListOf<Char>()
                    repeat(array[0]) {
                        stack.add(stacks[array[1] - 1].pop())
                    }

                    stacks[array[2] - 1].addAll(stack)
                }
        }
    return stacks.joinToString(transform = { it.last().toString() }, separator = "")
}

buildStacks()
val part1 = applyOperations()
```

## Part 2

Looks like the Elves misread the model number of the crane. This is a
CrateMover 9001 which can take multiple crates at once. 

### Modifying the applyOperations function

This result can be achieved by making small modifications to the
applyOperations function we used for part 1. First things first let's add
a Boolean argument to the function which denotes whether or not to move
multiple crates at once.

```kotlin
fun applyOperations(moveMultipleAtOnce: Boolean): String
```

Next, let's modify the temporary `stack` to be added in reverse when
`moveMultipleAtOnce` is true.
```kotlin
stacks[array[2] - 1].addAll(
    stack.apply {
        if (moveMultipleAtOnce) {
            reverse()
        }
    }
)
```
That's all there is to it!

### Solution
```kotlin
 fun applyOperations(moveMultipleAtOnce: Boolean): String {
    input.filter { it.startsWith("move") }
        .forEach { l ->
            l.split(" ")
                .filter { it.toIntOrNull() != null }
                .map { it.toInt() }
                .let { array -> // Number of crates, origin, destination
                    val stack = mutableListOf<Char>()
                    repeat(array[0]) {
                        stack.add(stacks[array[1] - 1].pop())
                    }

                    stacks[array[2] - 1].addAll(
                        stack.apply {
                            if (moveMultipleAtOnce) {
                                reverse()
                            }
                        }
                    )
                }
        }
    return stacks.joinToString(transform = { it.last().toString() }, separator = "")
}
buildStacks()
val part2 = applyOperations(moveMultipleAtOnce = true)
```

---
## Full Solution
```kotlin
import java.util.*

fun main() {
    val input = readInput("Day05")
    val stackLabelIndex = input.indexOf("") - 1
    lateinit var stacks: MutableList<Stack<Char>>

    fun buildStacks() {
        stacks = MutableList(input[stackLabelIndex].trim().substringAfterLast(" ").toInt()) { Stack<Char>() }
        for (i in stackLabelIndex - 1 downTo 0) {
            val line = input[i]
            for (j in 1..line.length step 4) {
                if (line[j] != ' ') {
                    stacks[(j - 1) / 4].push(line[j])
                }
            }
        }
    }

    fun applyOperations(moveMultipleAtOnce: Boolean): String {
        input.filter { it.startsWith("move") }
            .forEach { l ->
                l.split(" ")
                    .filter { it.toIntOrNull() != null }
                    .map { it.toInt() }
                    .let { array -> // Number of crates, origin, destination
                        val stack = mutableListOf<Char>()
                        repeat(array[0]) {
                            stack.add(stacks[array[1] - 1].pop())
                        }

                        stacks[array[2] - 1].addAll(
                            stack.apply {
                                if (moveMultipleAtOnce) {
                                    reverse()
                                }
                            }
                        )
                    }
            }
        return stacks.joinToString(transform = { it.last().toString() }, separator = "")
    }

    buildStacks()
    val part1 = applyOperations(moveMultipleAtOnce = false)
    buildStacks()
    val part2 = applyOperations(moveMultipleAtOnce = true)
    part1.println()
    part2.println()
}
```