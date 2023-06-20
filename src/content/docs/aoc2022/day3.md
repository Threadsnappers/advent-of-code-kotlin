---
title: Day 3 - Rucksack Reorganization 🧳
description: A solution to day 3
template: doc
---
Packing is a hassle for both Elves and humans alike. Today's puzzle is all about helping
the Elves rearrange the items in their rucksacks! 

---

## Analyzing the input

The given data is a list of rucksacks with the items contained inside. Each line represents
the items inside a rucksack. 

```
vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw
```
Internally, every rucksack is divided into two compartments at exactly midway. For instance,
the first compartment of the first rucksack holds items `vJrwpWtwJgWr` and the `hcsFMMfFFhFp`
in the second.

Additionally, each item has a rearrangement priority value. `a - z` have priorities `1 - 26` 
and `A - Z`, `27 - 52`.

--- 
## Part 1

All items of the same type are supposed to be in the same compartment of a rucksack, which
means there should not be items which appear in both compartments of the same rucksack. Part 1
involves finding the item commont to both the compartments of every rucksack and summing up their
priority values.

### Grouping items in compartments

For each line(`l`) the first step is to use 
[`substring()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/substring.html)
to group the items in two compartments. The first compartment contains items from index
`0` to `l.length/2 - 1` and second has the rest.

```kotlin
line.substring(0, l.length/2)
// substring is end exclusive so l.length/2 is not included

line.substring(l.length/2) 
// equivalent to substring(l.length/2, l.length)
```

### Finding the common item
Now that items have been assigned their compartments, the next step is to find
the common item. Consider each compartment as a
[`Set`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/)
of elements. Does that give you an idea? Yes! The intersection of the two sets
should give the common element!

A `String` can be directly converted to a `Set` of characters using the 
[`toSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-set.html)
function. Once that's done, we can use  [`intersect()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/intersect.html)
to get the common element.

```kotlin
l.substring(0, l.length / 2).toSet()
    .intersect(l.substring(l.length / 2).toSet())
```
But wait, the result is still a `Set`! This is because `intersect()` returns all the
elements common to the `Set`s. The question states that there'll be only one item
which would appear in both compartments. Therefore we can take just the
[`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html)
element.
```kotlin
l.substring(0, l.length / 2).toSet()
    .intersect(l.substring(l.length / 2).toSet())
    .first()
```

### Evaluating the priority

Priority for the character can be found through a few simple operations using ASCII
codes [like how we solved day 2](https://threadsnappers.github.io/advent-of-code-kotlin/aoc2022/day2/). If the character 
[`isLowerCase`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-lower-case.html)
then you only have to substract code of `'a'` from the char and then add 1. Otherwise,
subtract `'A'` from the item and then add 27.

```kotlin
if (it.isLowerCase()) it - 'a' + 1 else it - 'A' + 27
```

### Combining these steps into one

[Scope functions](https://kotlinlang.org/docs/scope-functions.html) are great for 
running code in the context of the value of an object. The above steps can be
tied together with
[let](https://kotlinlang.org/docs/scope-functions.html#let).

:::tip[Scope functions]
The other scope functions are `run`, `with`, `apply`, `also`, `takeIf` and `takeUnless`!
:::

```kotlin
l.substring(0, l.length / 2).toSet()
    .intersect(l.substring(l.length / 2).toSet())
    .first()
    .let {
        if (it.isLowerCase()) it - 'a' + 1 else it - 'A' + 27
    }
```

### [`sumOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum-of.html) priorities

Since we have figured out how to process each line, all that is left is to add
up the priorities. And that's it for part 1!

:::tip[Tip!]
[`sumOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum-of.html) 
can be thought of as a combination of 
[`map()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map.html) and 
[`sum()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum.html)!
:::
```kotlin
input.sumOf { l ->
    l.substring(0, l.length / 2).toSet()
    .intersect(l.substring(l.length / 2).toSet())
    .first()
    .let {
        if (it.isLowerCase()) it - 'a' + 1 else it - 'A' + 27
    }
}
```

### Solution
```kotlin
val part1 = input.sumOf { l ->
    l.substring(0, l.length / 2).toSet()
    .intersect(l.substring(l.length / 2).toSet())
    .first()
    .let {
        if (it.isLowerCase()) it - 'a' + 1 else it - 'A' + 27
    }
}
```
---

## Part 2

Looks like the Elves are facing another problem - this time they seem to have lost their
group badges. Elves are divided into groups of three and assigned a badge depending on
the item common by all three of them.

```
vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
```
This is the first group in the sample data. Their badge is `r` because that's the only
item appearing in the rucksacks of all three Elves.

Part 2 involves summing up the priorities of the badges.

### Finding the common item

Following the same principle we used in the [part 1](#finding-the-common-item), we can
use sets to find the intersection in the three item `Set`s. This time we'll need two
intersect calls. Assuming we have the three rucksacks available as a `List<String>`
we can implement this like so:
```kotlin
list[0].toSet()
    .intersect(list[1].toSet())
    .intersect(list[2].toSet())
```
:::tip[Infix functions!]
An alternate way to make the code a little more cleaner, is to use the
[infix version](https://kotlinlang.org/docs/functions.html#infix-notation) of
`intersect()`. 

This way the code can be written as:
```kotlin
(list[0].toSet() intersect list[1].toSet() intersect list[2].toSet())
```
The outermost brackets are for making sure that the statements inside are
executed first before proceeding with the rest of the call chain.
:::
Since it is given that there'll be only one item in common, we only need to take the first
element of the Set and find its priority, just like how we did in part 1.
```kotlin
list[0].toSet()
    .intersect(list[1].toSet())
    .intersect(list[2].toSet())
    .first()
    .let {
        if (it.isLowerCase()) it - 'a' + 1 else it - 'A' + 27
    }
```
All that remains is to divide the Elves into groups of three.
### Dividing Elves into groups

Splitting the input into groups of three can be done with the 
[`chunked()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/chunked.html)
function in the [Collections API](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/).

```kotlin
input.chunked(3)
```
### Summing it up
Finally, using [`sumOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sum-of.html)
we can find the total of all the priorities.
```kotlin
input.chunked(3)
    .sumOf { list ->
        list[0].toSet().intersect(list[1].toSet()).intersect(list[2].toSet()).first().let {
            if (it.isLowerCase()) it - 'a' + 1 else it - 'A' + 27
        }
    }
```
### Solution
```kotlin
val part2 = input.chunked(3)
    .sumOf { list ->
        list[0].toSet().intersect(list[1].toSet()).intersect(list[2].toSet()).first().let {
            if (it.isLowerCase()) it - 'a' + 1 else it - 'A' + 27
        }
    }
```
Hats off to you for conquering day 3 of Advent of Code! Well done!



## Full Solution
```kotlin
fun main() {
    val input = readInput("Day03")
    val part1 = input.sumOf { l ->
        l.substring(0, l.length / 2).toSet()
        .intersect(l.substring(l.length / 2).toSet())
        .first()
        .let {
            if (it.isLowerCase()) it - 'a' + 1 else it - 'A' + 27
        }
    }
    val part2 = input.chunked(3).sumOf { list ->
        list[0].toSet()
            .intersect(list[1].toSet())
            .intersect(list[2].toSet())
            .first()
            .let {
                if (it.isLowerCase()) it - 'a' + 1 else it - 'A' + 27
            }
    }
    part1.println()
    part2.println()
}
```
[Open in Playground](https://pl.kotl.in/bQ-TNt2JY)
[GitHub](https://github.com/Sasikuttan2163/AoC-2022-Solutions-In-Kotlin/blob/main/src/Day03.kt)
