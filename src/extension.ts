import * as vscode from 'vscode'
import { convertSingleHashKey, convertAllHashKeys } from './plugins/convert_hash_keys/subscription'
import { moveParamRight, moveParamLeft } from './plugins/params_sidemove/subscription'
import { jumpToLastMigration } from './plugins/jump_to_last_migration/subscription'
import { foldAllDescribes, foldAllContexts, foldAllIts } from './plugins/fold_all/subscription'
import { openNotepad } from './plugins/open_notepad/subscription'
import { copyAbsolutePathWithLineNumber, copyRelativePathWithLineNumber } from './plugins/copy_path_with_line_number/subscription'
import { selectAroundBlock, selectInsideBlock, selectAroundDefBlock, selectInsideDefBlock } from './plugins/select_block/subscription'
import { invertSelectionDirection } from './plugins/invert_selection_direction/subscription'
import { extractSelectionToPrivateMethod } from './plugins/extract_selection_to_method/subscription'
import { changeRubyBlockSyntax } from './plugins/change_ruby_block_syntax/subscription'

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(vscode.commands.registerCommand('ruby-multitool.convertSingleHashKey', convertSingleHashKey))
  context.subscriptions.push(vscode.commands.registerCommand('ruby-multitool.convertAllHashKeys', convertAllHashKeys))

  context.subscriptions.push(vscode.commands.registerCommand('ruby-multitool.moveParamRight', moveParamRight))
  context.subscriptions.push(vscode.commands.registerCommand('ruby-multitool.moveParamLeft', moveParamLeft))

  context.subscriptions.push(vscode.commands.registerCommand('ruby-multitool.jumpToLastMigration', jumpToLastMigration))

  context.subscriptions.push(vscode.commands.registerCommand('ruby-multitool.foldAllDescribes', foldAllDescribes))
  context.subscriptions.push(vscode.commands.registerCommand('ruby-multitool.foldAllContexts', foldAllContexts))
  context.subscriptions.push(vscode.commands.registerCommand('ruby-multitool.foldAllIts', foldAllIts))

  context.subscriptions.push(vscode.commands.registerCommand('ruby-multitool.openNotepad', () => openNotepad(context)))

  context.subscriptions.push(vscode.commands.registerCommand('ruby-multitool.copyAbsolutePathWithLineNumber', copyAbsolutePathWithLineNumber))
  context.subscriptions.push(vscode.commands.registerCommand('ruby-multitool.copyRelativePathWithLineNumber', copyRelativePathWithLineNumber))

  context.subscriptions.push(vscode.commands.registerCommand('ruby-multitool.selectAroundBlock', () => selectAroundBlock(context)))
  context.subscriptions.push(vscode.commands.registerCommand('ruby-multitool.selectInsideBlock', () => selectInsideBlock(context)))
  context.subscriptions.push(vscode.commands.registerCommand('ruby-multitool.selectAroundDefBlock', () => selectAroundDefBlock(context)))
  context.subscriptions.push(vscode.commands.registerCommand('ruby-multitool.selectInsideDefBlock', () => selectInsideDefBlock(context)))

  context.subscriptions.push(vscode.commands.registerCommand('ruby-multitool.invertSelectionDirection', invertSelectionDirection))

  context.subscriptions.push(vscode.commands.registerCommand('ruby-multitool.extractSelectionToPrivateMethod', () => extractSelectionToPrivateMethod(context)))

  context.subscriptions.push(vscode.commands.registerCommand('ruby-multitool.changeRubyBlockSyntax', changeRubyBlockSyntax))
}
