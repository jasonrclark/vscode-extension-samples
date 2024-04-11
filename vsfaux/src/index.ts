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

const controller = context.subscriptions[0];
controller.refreshHandler()
	.then(() => {
		console.log(controller.items);

		controller.items.forEach((item: any, coll: any) => {
			controller.resolveHandler(item)
				.then(() => console.log(item))
				.catch((error: any) => console.error(error));
		});
	})
	.catch((error: any) => console.error(error));
