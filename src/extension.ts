// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ReadableStreamDefaultController } from 'stream/web';
import * as vscode from 'vscode';
import { convertSingleKey, convertAllKeys } from './plugins/hash_key_converter/subscription';
import { moveRight, moveLeft } from './plugins/params_sidemove/subscription';
import { jumpToLastMigration } from './plugins/jump_to_last_migration/subscription';
import { foldAllDescribes, foldAllContexts, foldAllIts } from './plugins/fold_all/subscription';
import { openNotepad } from './plugins/open_notepad/subscription';
import { copyAbsolutePathWithLineNumber, copyRelativePathWithLineNumber } from './plugins/copy_path_with_line_number/subscription';
import { selectAroundBlock, selectInsideBlock, selectAroundDefBlock, selectInsideDefBlock } from "./plugins/select_block/subscription";
import { invertSelectionDirection } from './plugins/invert_selection_direction/subscription';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "ruby-multitool" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  context.subscriptions.push(vscode.commands.registerCommand('ruby-multitool.convertSingleKey', convertSingleKey));
  context.subscriptions.push(vscode.commands.registerCommand('ruby-multitool.convertAllKeys', convertAllKeys));

  context.subscriptions.push(vscode.commands.registerCommand('ruby-multitool.moveRight', moveRight));
  context.subscriptions.push(vscode.commands.registerCommand('ruby-multitool.moveLeft', moveLeft));

  context.subscriptions.push(vscode.commands.registerCommand('ruby-multitool.jumpToLastMigration', jumpToLastMigration));

  context.subscriptions.push(vscode.commands.registerCommand('ruby-multitool.foldAllDescribes', foldAllDescribes));
  context.subscriptions.push(vscode.commands.registerCommand('ruby-multitool.foldAllContexts', foldAllContexts));
  context.subscriptions.push(vscode.commands.registerCommand('ruby-multitool.foldAllIts', foldAllIts));

  context.subscriptions.push(vscode.commands.registerCommand('ruby-multitool.openNotepad', () => openNotepad(context)));

  context.subscriptions.push(vscode.commands.registerCommand('ruby-multitool.copyAbsolutePathWithLineNumber', copyAbsolutePathWithLineNumber));
  context.subscriptions.push(vscode.commands.registerCommand('ruby-multitool.copyRelativePathWithLineNumber', copyRelativePathWithLineNumber));

  context.subscriptions.push(vscode.commands.registerCommand('ruby-multitool.selectAroundBlock', selectAroundBlock));
  context.subscriptions.push(vscode.commands.registerCommand('ruby-multitool.selectInsideBlock', selectInsideBlock));
  context.subscriptions.push(vscode.commands.registerCommand('ruby-multitool.selectAroundDefBlock', selectAroundDefBlock));
  context.subscriptions.push(vscode.commands.registerCommand('ruby-multitool.selectInsideDefBlock', selectInsideDefBlock));

  context.subscriptions.push(vscode.commands.registerCommand('ruby-multitool.invertSelectionDirection', invertSelectionDirection));
}
// this method is called when your extension is deactivated
export function deactivate() {}
