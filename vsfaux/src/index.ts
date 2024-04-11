import * as vscode from 'vscode';
import { activate } from "test-provider-sample"

const context = new vscode.ExtensionContext();
activate(context);