
export namespace tests {

	class MyTestController {
		constructor(id: string, label: string) {
			this.id = id;
			this.label = label;
		}

		readonly id: string;
		label: string;

		// resolveHandler?: (item: TestItem | undefined) => Thenable<void> | void;
		refreshHandler: ((token: CancellationToken) => Thenable<void> | void) | undefined;
	}

	export function createTestController(id: string, label: string): TestController {
		return new MyTestController(id, label);
	}
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
		return ""
	}

	toJSON(): any {
		return "";
	}
}

export interface TestItem {
	readonly id: string;
	readonly uri: Uri | undefined;
	// readonly children: TestItemCollection;
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

export interface TestController {
	readonly id: string;
	label: string;
	// readonly items: TestItemCollection;
	// createRunProfile(label: string, kind: TestRunProfileKind, runHandler: (request: TestRunRequest, token: CancellationToken) => Thenable<void> | void, isDefault?: boolean, tag?: TestTag, supportsContinuousRun?: boolean): TestRunProfile;
	// resolveHandler?: (item: TestItem | undefined) => Thenable<void> | void;
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