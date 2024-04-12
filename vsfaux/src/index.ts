import * as vscode from 'vscode';
import { activate } from "test-provider-sample"

const context = new vscode.ExtensionContext();
activate(context);

vscode.workspace.workspaceFolders.push({
	uri: vscode.Uri.from({
		scheme: "file",
		path: "/workspaces/vscode-extension-samples/test-provider-sample"
	}),
	name: "/test-provider-sample",
	index: 0
});

// Hacky find for our controller from within extension
const controller = context.subscriptions[0];

// Ask controller to refresh test items from the top
controller.refreshHandler()
	.then(() => {
		controller.items.forEach((item: any, coll: any) => {
			controller.resolveHandler(item)
				.then(() => {
					console.log(item);
					item.children.forEach((child: any, _ : any) => console.log(child));
				})
				.catch((error: any) => console.error(error));
		});
	})
	.catch((error: any) => console.error(error));
