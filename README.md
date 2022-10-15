# Ruby Multitool

A collection of a few minor plugins that should slightly enhance your productivity.
To maximize performance bind the commands with keyboard shortcuts.

## Features

- Change Ruby Block Syntax
- Copy Path With Number
- Extract To Private Method
- Fold All
- Hash Key Converter
- Invert Selection Direction
- Jump To Last Migration
- Open Notepad
- Params Sidemove
- Select Block

### Change Ruby Block Syntax

Allows toggle between selected `do end` and curly bracket `{}` block syntax

>command name: `ruby-multitool.changeRubyBlockSyntax`
>
>command title: `Ruby Multitool: Change ruby block syntax`

### Copy Path With Number

Saves in the system clipboard the active file absolute path appended with the line number where the cursor is.

>command name: `ruby-multitool.copyAbsolutePathWithLineNumber`
>
>command title: `Ruby Multitool: Copy absolute path with line number`

Example result:

```text
/Users/xxx/ruby-multitool/README.md:29
```

Saves in the system clipboard the active file relative path appended with the line number where the cursor is.

command name: `ruby-multitool.copyRelativePathWithLineNumber`

command title: `Ruby Multitool: Copy relative path with line number`

Example result:

```text
README.md:44
```

### Extract To Private Method

Moves selected text to a new private method.

>command name: `ruby-multitool.extractSelectionToPrivateMethod`
>
>command title: `Ruby Multitool: Extract selected text to private method`

### Fold All

Folds all 'describe' blocks without the one you are currently in.

>command name: `ruby-multitool.foldAllDescribes`
>
>command title: `Ruby Multitool: Fold all describe`

Folds all 'context' blocks without the one you are currently in.

>command name: `ruby-multitool.foldAllContexts`
>
>command title: `Ruby Multitool: Fold all context`

Folds all 'it' blocks without the one you are currently in.
>command name: `ruby-multitool.foldAllIts`
>
>command title: `Ruby Multitool: Fold all it`

Note: if you want to revert fold operations you can use the following command:
> command title: `Unfold All`

### Hash Key Converter

Converts hash key-value pair under the cursor.
>command name: `ruby-multitool.convertSingleKey`
>
>command title: `Ruby Multitool: Convert Single Key`

Selects the entire hash object and converts all of its key-value pairs.
>command name: `ruby-multitool.convertAllKeys`
>
>command title: `Ruby Multitool: Convert All Keys`

### Invert Selection Direction

Changes the selection direction.
>command name: `ruby-multitool.invertSelectionDirection`
>
>command title: `Ruby Multitool: Invert selection direction`

### Jump To Last Migration

Opens the newest rails migration file.
>command name: `ruby-multitool.jumpToLastMigration`
>
>command title: `Ruby Multitool: Jump to last created RoR migration`

### Open Notepad

Opens notepad file that is unique for each workspace.
>command name: `ruby-multitool.openNotepad`
>
>command title: `Ruby Multitool: Open project notepad`

### Params Sidemove

Moves params under the cursor position to the right.
>command name: `ruby-multitool.moveRight`
>
>command title: `Ruby Multitool: Move Key Value Right`

Moves params under the cursor position to the left.
>command name: `ruby-multitool.moveLeft`
>
>command title: `Ruby Multitool: Move Key Value Left`

### Select Block

Selects `do end` block along with the block opening and closing.
>command name: `ruby-multitool.selectAroundBlock`
>
>command title: `Ruby Multitool: Select around block you are currently in`

Selects only what is inside the `do end` block.
>command name: `ruby-multitool.selectAroundBlock`
>
>command title: `Ruby Multitool: Select around block you are currently in`

Selects `def` block along with the block opening and closing.
>command name: `ruby-multitool.selectAroundDefBlock`
>
>command title: `Ruby Multitool: Select around def block you are currently in`

Selects only what is inside the `def` block.
>command name: `ruby-multitool.selectInsideDefBlock`
>
>command title: `Ruby Multitool: Select inside def block you are currently in`

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...
