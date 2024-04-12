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
vscode.tests.testControllers().forEach((controller: any) => {
	// Ask controller to refresh test items from the top
	controller.refreshHandler()
		.then(() => {
			const resolutions: PromiseLike<void>[] = [];
			controller.items.forEach((item: any, _: any) => {
				resolutions.push(
						controller.resolveHandler(item)
						.then(() => {
							console.log(item);
							item.children.forEach((child: any, _ : any) => console.log(child));
						})
						.catch((error: any) => console.error(error)));
			})

			Promise.all(resolutions)
				.then(() => {
					console.log("proof!");
					console.log(controller.profiles[0].runHandler({
						include: [controller.items[0]],
						continuous: false
					}));
				});
		})
		.catch((error: any) => console.error(error));
});
