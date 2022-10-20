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

![multitool-fold](https://user-images.githubusercontent.com/18404037/196281056-95ff737a-73ce-47be-a8f8-d31735080620.gif)

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

![multitool-fold](https://user-images.githubusercontent.com/18404037/196282960-0205daca-0f39-4433-98a8-a942766e47af.gif)

Moves selected text to a new private method.

>command name: `ruby-multitool.extractSelectionToPrivateMethod`
>
>command title: `Ruby Multitool: Extract selected text to private method`

### Fold All

![multitool-fold](https://user-images.githubusercontent.com/18404037/196279250-187e59c7-363f-4f3d-9636-e486eef35fbd.gif)

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

### Convert Hash Keys

![multitool-fold](https://user-images.githubusercontent.com/18404037/196284705-662acd84-4354-4afb-9a0b-b8a8616c9afb.gif)

Converts hash key under the cursor.
>command name: `ruby-multitool.convertSingleHashKey`
>
>command title: `Ruby Multitool: Convert Single Hash Key`

Selects the entire hash object and converts all of its keys.
>command name: `ruby-multitool.convertAllHashKeys`
>
>command title: `Ruby Multitool: Convert All Hash Keys`

### Invert Selection Direction

![multitool-fold](https://user-images.githubusercontent.com/18404037/196770937-8edee137-cff8-4fa6-8264-b0581a7a89af.gif)

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

![multitool-fold](https://user-images.githubusercontent.com/18404037/196285733-7f053307-5dd9-49b5-b63f-693ac0be8f18.gif)

Moves param under the cursor position to the right.
>command name: `ruby-multitool.moveParamRight`
>
>command title: `Ruby Multitool: Move Param Right`

Moves param under the cursor position to the left.
>command name: `ruby-multitool.moveParamLeft`
>
>command title: `Ruby Multitool: Move Param Left`

### Select Block

![multitool-fold](https://user-images.githubusercontent.com/18404037/196769968-4e39122b-f22a-48a8-8134-9ce5a6bb372d.gif)

Selects `ruby` block along with the block opening and closing.
>command name: `ruby-multitool.selectAroundBlock`
>
>command title: `Ruby Multitool: Select around block you are currently in`

Selects only what is inside the `ruby` block.
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

The initial release of the following plugins:

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
