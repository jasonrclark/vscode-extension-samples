import { readFile } from 'fs/promises';

export namespace tests {

	class MyTestController {
		constructor(id: string, label: string) {
			this.id = id;
			this.label = label;
		}

		readonly id: string;
		label: string;

		readonly items: TestItemCollection = new MyTestItemCollection();

		createRunProfile(label: string,
			kind: TestRunProfileKind,
			runHandler: (request: TestRunRequest, token: CancellationToken) => Thenable<void> | void,
			isDefault?: boolean,
			tag?: TestTag,
			supportsContinuousRun?: boolean): TestRunProfile {
			return new MyTestRunProfile();
		}

		// resolveHandler?: (item: TestItem | undefined) => Thenable<void> | void;
		refreshHandler: ((token: CancellationToken) => Thenable<void> | void) | undefined;
		// createTestRun(request: TestRunRequest, name?: string, persist?: boolean): TestRun;

		createTestItem(id: string, label: string, uri?: Uri): TestItem {
			console.log(`Creating test... ${id}, ${label}`)

			return {
				id,
				uri,
				children: new MyTestItemCollection(),
				parent: undefined,
				canResolveChildren: false,
				busy: false,
				label,
			}
		}

		// invalidateTestResults(items?: TestItem | readonly TestItem[]): void;
		// dispose(): void;
	}

	class MyTestRunProfile {
		label: string;
		readonly kind: TestRunProfileKind;
		isDefault: boolean;

		constructor() {
			this.label = "labelled";
			this.kind = TestRunProfileKind.Run;
			this.isDefault = false;
		}

		// onDidChangeDefault: Event<boolean>;
		// supportsContinuousRun: boolean;
		// tag: TestTag | undefined;
		// configureHandler: (() => void) | undefined;
		// runHandler: (request: TestRunRequest, token: CancellationToken) => Thenable<void> | void;
		// loadDetailedCoverage?: (testRun: TestRun, fileCoverage: FileCoverage, token: CancellationToken) => Thenable<FileCoverageDetail[]>;
		// dispose(): void;
	}

	class MyTestItemCollection implements TestItemCollection {
		size: number;
		items: Map<string, TestItem>;

		constructor() {
			this.items = new Map<string, TestItem>();
			this.size = this.items.size;
		}

		replace(items: readonly TestItem[]): void {
			this.items = new Map<string, TestItem>();
			items.forEach((item) => this.add(item));
		}

		forEach(callback: (item: TestItem, collection: TestItemCollection) => unknown, thisArg?: any): void {
			this.items.forEach((item) => callback.call(this, item, this));
		}

		add(item: TestItem): void {
			this.items.set(item.id, item);
			this.size = this.items.size;
		}

		delete(itemId: string): void {
			this.items.delete(itemId);
			this.size = this.items.size;
		}

		get(itemId: string): TestItem | undefined {
			return this.items.get(itemId);
		}

		[Symbol.iterator](): Iterator<[id: string, testItem: TestItem], any, undefined> {
			return this.items.entries();
		}
	}

	const controllers: TestController[] = [];

	export function testControllers(): TestController[] {
		return controllers;
	}

	export function createTestController(id: string, label: string): TestController {
		const controller =  new MyTestController(id, label);
		controllers.push(controller)
		return controller;
	}
}

export namespace workspace {
	export const textDocuments: readonly TextDocument[] = [];
	export const workspaceFolders: readonly WorkspaceFolder[] | undefined = [];
	export const fs: FileSystem = {
		readFile(uri: Uri): Thenable<Uint8Array> {
			return readFile(uri.path);
		}
	}

	// FIXME: Doesn't actually find, just returns the known file
	export function findFiles(include: GlobPattern, exclude?: GlobPattern | null, maxResults?: number, token?: CancellationToken): Thenable<Uri[]> {
		return Promise.resolve([
			Uri.from({scheme: "file", path: "/workspaces/vscode-extension-samples/test-provider-sample/README.md"})
		]);
	}

	export const onDidOpenTextDocument: Event<TextDocument> =
		(listener: (e: TextDocument) => any, thisArgs?: any, disposables?: Disposable[]): Disposable => {
			return new Disposable(() => { });
		};

	export const onDidChangeTextDocument: Event<TextDocumentChangeEvent> =
		(listener: (e: TextDocumentChangeEvent) => any, thisArgs?: any, disposables?: Disposable[]): Disposable => {
			return new Disposable(() => { });
		};
}

export interface WorkspaceFolder {
	readonly uri: Uri;
	readonly name: string;
	readonly index: number;
}

export class RelativePattern {
	baseUri: Uri;
	base: string;
	pattern: string;

	constructor(base: WorkspaceFolder | Uri | string, pattern: string) {
		this.baseUri = Uri.from({scheme: "bunk"}),
		this.base = "";
		this.pattern = pattern;
	}
}

export type GlobPattern = string | RelativePattern;

export interface TextDocument {

	readonly uri: Uri;
	readonly fileName: string;
	readonly isUntitled: boolean;
	readonly languageId: string;
	readonly version: number;
	readonly isDirty: boolean;
	readonly isClosed: boolean;

	save(): Thenable<boolean>;

	// readonly eol: EndOfLine;
	// readonly lineCount: number;
	// lineAt(line: number): TextLine;
	// lineAt(position: Position): TextLine;
	// offsetAt(position: Position): number;
	// positionAt(offset: number): Position;
	// getText(range?: Range): string;
	// getWordRangeAtPosition(position: Position, regex?: RegExp): Range | undefined;
	// validateRange(range: Range): Range;
	// validatePosition(position: Position): Position;
}

export interface TextDocumentChangeEvent {
	readonly document: TextDocument;
	// readonly contentChanges: readonly TextDocumentContentChangeEvent[];
	// readonly reason: TextDocumentChangeReason | undefined;
}

export class StatementCoverage {
	executed: number | boolean;
	location: Position | Range;
	// branches: BranchCoverage[];

	constructor(executed: number | boolean, location: Position | Range, branches?: any[]) {
		this.executed = executed;
		this.location = location;
		// this.branches = branches;
	}
}

export class Range {
	readonly start: Position;
	readonly end: Position;

	constructor(start: Position, end: Position) {
		this.start = start;
		this.end = end;
	}
}

export class Position {
	readonly line: number;
	readonly character: number;

	constructor(line: number, character: number) {
		this.line = line;
		this.character = character;
	}

	// isBefore(other: Position): boolean;
	// isBeforeOrEqual(other: Position): boolean;
	// isAfter(other: Position): boolean;
	// isAfterOrEqual(other: Position): boolean;
	// isEqual(other: Position): boolean;
	// compareTo(other: Position): number;
	// translate(lineDelta?: number, characterDelta?: number): Position;
	// translate(change: {
	// 	lineDelta?: number;
	// 	characterDelta?: number;
	// }): Position;
	// with(line?: number, character?: number): Position;
	// with(change: {
	// 	line?: number;
	// 	character?: number;
	// }): Position;
}

export interface FileSystem {

	// stat(uri: Uri): Thenable<FileStat>;
	// readDirectory(uri: Uri): Thenable<[string, FileType][]>;
	// createDirectory(uri: Uri): Thenable<void>;
	readFile(uri: Uri): Thenable<Uint8Array>;
	// writeFile(uri: Uri, content: Uint8Array): Thenable<void>;
	// delete(uri: Uri, options?: {
	// 	recursive?: boolean;
	// 	useTrash?: boolean;
	// }): Thenable<void>;
	// rename(source: Uri, target: Uri, options?: {
	// 	overwrite?: boolean;
	// }): Thenable<void>;
	// copy(source: Uri, target: Uri, options?: {
	// 	overwrite?: boolean;
	// }): Thenable<void>;
	// isWritableFileSystem(scheme: string): boolean | undefined;
}


interface Thenable<T> extends PromiseLike<T> { }

export class Uri {
	static parse(value: string, strict?: boolean): Uri {
		return new Uri("", "", "", "", "");
	}

	static file(path: string): Uri {
		return new Uri("", "", "", "", "");
	}

	static joinPath(base: Uri, ...pathSegments: string[]): Uri {
		return new Uri("", "", "", "", "");
	}

	static from(components: {
		/**
		 * The scheme of the uri
		 */
		readonly scheme: string;
		/**
		 * The authority of the uri
		 */
		readonly authority?: string;
		/**
		 * The path of the uri
		 */
		readonly path?: string;
		/**
		 * The query string of the uri
		 */
		readonly query?: string;
		/**
		 * The fragment identifier of the uri
		 */
		readonly fragment?: string;
	}): Uri {
		return new Uri(
			components.scheme,
			components.authority ?? "",
			components.path ?? "",
			components.query ?? "",
			components.fragment ?? "");
	}

	private constructor(scheme: string, authority: string, path: string, query: string, fragment: string) {
		this.scheme     = scheme;
		this.authority  = authority;
		this.path       = path;
		this.query      = query;
		this.fragment   = fragment;
		this.fsPath     = "";
	}

	readonly scheme: string;
	readonly authority: string;
	readonly path: string;
	readonly query: string;
	readonly fragment: string;
	readonly fsPath: string;

	with(change: {
		/**
		 * The new scheme, defaults to this Uri's scheme.
		 */
		scheme?: string;
		/**
		 * The new authority, defaults to this Uri's authority.
		 */
		authority?: string;
		/**
		 * The new path, defaults to this Uri's path.
		 */
		path?: string;
		/**
		 * The new query, defaults to this Uri's query.
		 */
		query?: string;
		/**
		 * The new fragment, defaults to this Uri's fragment.
		 */
		fragment?: string;
	}): Uri {
		return new Uri("", "", "", "", "");
	}

	toString(skipEncoding?: boolean): string {
		return `${this.scheme}://${this.path}`;
	}

	toJSON(): any {
		return "";
	}
}

export enum TestRunProfileKind {
	/**
	 * The `Run` test profile kind.
	 */
	Run = 1,
	/**
	 * The `Debug` test profile kind.
	 */
	Debug = 2,
	/**
	 * The `Coverage` test profile kind.
	*/
	Coverage = 3,
}

export interface TestItem {
	readonly id: string;
	readonly uri: Uri | undefined;
	readonly children: TestItemCollection;
	readonly parent: TestItem | undefined;
	// tags: readonly TestTag[];
	canResolveChildren: boolean;
	busy: boolean;
	label: string;
	description?: string;
	sortText?: string | undefined;
	// range: Range | undefined;
	// error: string | MarkdownString | undefined;
}

export interface TestItemCollection extends Iterable<[id: string, testItem: TestItem]> {
	readonly size: number;
	replace(items: readonly TestItem[]): void;
	forEach(callback: (item: TestItem, collection: TestItemCollection) => unknown, thisArg?: any): void;
	add(item: TestItem): void;
	delete(itemId: string): void;
	get(itemId: string): TestItem | undefined;
}

export class TestRunRequest {
	readonly include: readonly TestItem[] | undefined;
	readonly exclude: readonly TestItem[] | undefined;
	readonly profile: TestRunProfile | undefined;
	readonly continuous?: boolean;

	constructor(include?: readonly TestItem[], exclude?: readonly TestItem[], profile?: TestRunProfile, continuous?: boolean) {
		this.include = include
		this.exclude = exclude
		this.profile = profile
		this.continuous = continuous
	}
}

export interface TestRunProfile {
	label: string;
	readonly kind: TestRunProfileKind;
	isDefault: boolean;
	// onDidChangeDefault: Event<boolean>;
	// supportsContinuousRun: boolean;
	// tag: TestTag | undefined;
	// configureHandler: (() => void) | undefined;
	// runHandler: (request: TestRunRequest, token: CancellationToken) => Thenable<void> | void;
	// loadDetailedCoverage?: (testRun: TestRun, fileCoverage: FileCoverage, token: CancellationToken) => Thenable<FileCoverageDetail[]>;
	// dispose(): void;
}

export class TestTag {
	readonly id: string;

	constructor(id: string) {
		this.id = id;
	}
}

export interface TestController {
	readonly id: string;
	label: string;
	// readonly items: TestItemCollection;
	// createRunProfile(label: string, kind: TestRunProfileKind, runHandler: (request: TestRunRequest, token: CancellationToken) => Thenable<void> | void, isDefault?: boolean, tag?: TestTag, supportsContinuousRun?: boolean): TestRunProfile;
	resolveHandler?: (item: TestItem | undefined) => Thenable<void> | void;
	refreshHandler: ((token: CancellationToken) => Thenable<void> | void) | undefined;
	// createTestRun(request: TestRunRequest, name?: string, persist?: boolean): TestRun;
	// createTestItem(id: string, label: string, uri?: Uri): TestItem;
	// invalidateTestResults(items?: TestItem | readonly TestItem[]): void;
	// dispose(): void;
}

export interface Event<T> {
	(listener: (e: T) => any, thisArgs?: any, disposables?: Disposable[]): Disposable;
}

export class Disposable {
	static from(...disposableLikes: {
		/**
		 * Function to clean up resources.
		 */
		dispose: () => any;
	}[]): Disposable {
		return new Disposable(() => {});
	}

	constructor(callOnDispose: () => any) {
	}

	dispose(): any {
	}
}

export interface CancellationToken {
	isCancellationRequested: boolean;
	onCancellationRequested: Event<any>;
}

// Stubbed just to stumble through
// Almost certainly will require its own actual implementation
export class EventEmitter<T> {
	constructor() {
		this.event = (listener: (e: T) => any, thisArgs?: any, disposables?: Disposable[]): Disposable => {
			return new Disposable(() => {});
		};
	}

	event: Event<T>;

	fire(data: T): void {
	}

	dispose(): void {
	}
}

export class ExtensionContext {
	public constructor() {
		this.subscriptions = [];
	}

	readonly subscriptions: {
		dispose(): any;
	}[];
}