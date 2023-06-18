---
title: Day 1 - Calorie Counting 🍗 
description: A solution to Day 1
template: doc
---

In this post I'll be walking you through my [day 1](https://adventofcode.com/2022/day/1)
[Advent of Code 2022](https://adventofcode.com/2022)
solution. The first step in every solution is to of course
read the input. Here the test input is stored in
a text file with the name `Day01.txt`. For this I
used the default `readInput()` function provided in
the [AoC 2022 official repo template](https://github.com/kotlin-hands-on/advent-of-code-kotlin-template) which returns a `List<String>`.

---
## Analyzing the input
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

---
## Part 1

### Grouping the food of each Elf
The input for the first two elves initially looks like this `["1000", "2000", "3000", "", "4000"]`. 
Notice the blank string after 3000? That marks the 
separator between two adjacent elves. The [`joinToString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to-string.html) function joins every element in the list to a String with each element separated by the `separator` which in this case is a space. 

```kotlin 
readInput("Day01").joinToString(separator = " ", transform = { it })
```
The result is a String which looks like 
```
1000 2000 3000  4000
```
The blank string after 3000 now has double space in the string.
To group the calories of each Elf, the string is split at every double space. 
```kotlin
.split("  ") // Double space
```
The input has now been reduced to `["1000 2000 3000", "4000"]`. 

### Computing calory count of Elves
Next step is to once again split the
string in each element and sum it up. The [`map()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map.html) function applies an operation to every element
in a collection. Every element has to be processed like so:

1. Split around every space. 
```
"1000 2000 3000"" -> ["1000", "2000", "3000"]
```
2. Convert every element in the list to `Int`s so that they can be added.
```
["1000", "2000", "3000"] -> [1000, 2000, 3000]
```
3. And finally, add them up to get a single value.
```
[1000, 2000, 3000] -> 6000
```

Using map, the above three steps can be done together.
```kotlin
.map { it.split(" ").sumOf { n -> n.toInt() } }
```
```kotlin
val calories = readInput("Day01")
    .joinToString (separator = " ", transform = { it })
    .split("  ")
    .map { it.split(" ").sumOf { n -> n.toInt() } }
```
The result is a `List` of `Int` with total calorie count carried by each Elf. Let's assign this
to a variable `calories` so that it can be used again for part 2.

Once the calorie count of all the elves has been computed, there's only one thing left to do -
print the highest calory count. For this we can use the [`max()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/max.html) function.

```kotlin
val part1 = calories.max()
```

### Solution

```kotlin
val calories = readInput("Day01")
    .joinToString (separator = " ", transform = { it })
    .split("  ")
    .map { it.split(" ").sumOf { n -> n.toInt() } }
val part1 = calories.max()
```
---
## Part 2

Part 2 is pretty much the same as part 1 except that here you need to find the top three elves
with most number of calorie count in their inventory and sum it up. For this I sorted the
`calories` list and then summed up the last three elements.

### Solution
```kotlin
val part2 = calories.sorted()
    .takeLast(3)
    .sum()
```
[`takeLast(n)`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take-last.html)
returns the last `n` elements in the list and [`sum()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum.html) adds it up. There you have it, we're one
day clear of the 25 day advent! 🎉
## Full Solution
```kotlin
fun main() {
    val input = readInput("Day01")
    val calories = input.joinToString (separator = " ", transform = { it })
        .split("  ")
        .map { it.split(" ").sumOf { n -> n.toInt() } }
    val part1 = calories.max()
    val part2 = calories.sorted()
        .takeLast(3)
        .sum()
    part1.println()
    part2.println()
}
```

[Open in Playground](https://pl.kotl.in/Z51h2eaMo) [GitHub](https://github.com/Sasikuttan2163/AoC-2022-Solutions-In-Kotlin/blob/main/src/Day01.kt)

:::note[Note]
My solutions aren't the most efficient or
concise solutions you'll find. I try to make the 
logic clear while keeping the code readable.
:::