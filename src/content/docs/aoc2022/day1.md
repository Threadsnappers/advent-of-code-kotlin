---
title: Day 1 - Calorie Counting
description: A solution to Day 1
template: doc
---

I'll walk you through my day 1 AoC solution.
The first step in every solution is to of course
read the input. Here the test input is stored in
a text file with the name `Day01.txt`. For this I
used the default `readInput()` function provided in
the [AoC 2022 official repo template](https://github.com/kotlin-hands-on/advent-of-code-kotlin-template) which returns a `List<String>`.

The input consists of numbers which represents the calorie count of
the meals taken by the Elves. The inventory of one Elf is separated
from the next by newlines. Let's take a look at the sample input to
make it clear.

```
1000    # first elf
2000
3000

4000    # second elf

5000    # third and so on
6000

7000
8000
9000

10000
```

This contains the inventory data of five elves. The sum of the numbers
gives the total calories in the snacks carried by each elf. Part 1 involves
finding the number of calories being carried by the elf with the most
calories.

## Part 1

To find the highest calorie count, you need to compute the calorie count of
every elf first. For this I used a few functions in the [Kotlin Collections API](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/)

```kotlin
val calories = readInput("Day01")
        .joinToString (separator = " ", transform = { it })
        .split("  ")
        .map { it.split(" ").sumOf { n -> n.toInt() } }
        .toMutableList()
```
Let's analyze this part by part. The input for the first two elves initially looks like this
`["1000", "2000", "3000", "", "4000"]`. Notice the blank string after 3000? That marks the 
separator between two adjacent elves. The [`joinToString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to-string.html) function joins every element in the list to a String with each
element separated by the `separator` which in this case is a space. The result is a String which
looks like `1000 2000 3000  4000`. The blank string after 3000 now has double space in the string.
To group the calories of each elf, the string is split at every double space. 

The input has been reduced to `["1000 2000 3000", "4000"]`. Next step is to once again split the
string in each element and sum it up. The `map` function applies the operation to every element
in the collection to give us `[6000, 4000]`. This is stored as the list `calories`.

Once the calorie count of all the elves has been computed, there's only one thing left to do -
print the highest calory count. For this we can use the [`max()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max.html) function.

```kotlin
val part1 = calories.max()
```

## Full Solution
```kotlin
fun main() {
    val input = readInput("Day01")
    val calories = input.joinToString (separator = " ", transform = { it })
        .split("  ")
        .map { it.split(" ").sumOf { n -> n.toInt() } }
        .toMutableList()
    val part1 = calories.max()
    val part2 = calories.sorted()
        .takeLast(3)
        .sum()
    part1.println()
    part2.println()
}
```


*NOTE: My solutions aren't the most efficient or
concise solutions you'll find. I try to make the 
logic clear while keeping the code readable.*
