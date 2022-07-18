/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { URI } from 'vs/base/common/uri';
import { ILocalizedString } from 'vs/platform/action/common/action';
import { localize } from 'vs/nls';
import { Action2, registerAction2 } from 'vs/platform/actions/common/actions';
import { ContextKeyExpr } from 'vs/platform/contextkey/common/contextkey';
import { INativeHostService } from 'vs/platform/native/electron-sandbox/native';
import { ITerminalService } from 'vs/workbench/contrib/terminal/browser/terminal';
import { ServicesAccessor } from 'vs/platform/instantiation/common/instantiation';
import { TerminalCommandId, TERMINAL_ACTION_CATEGORY } from 'vs/workbench/contrib/terminal/common/terminal';
import { TerminalContextKeys } from 'vs/workbench/contrib/terminal/common/terminalContextKey';

export function registerTerminalActions() {
	const category: ILocalizedString = { value: TERMINAL_ACTION_CATEGORY, original: 'Terminal' };

	registerAction2(class extends Action2 {
		constructor() {
			super({
				id: TerminalCommandId.OpenWorkingDirectory,
				title: { value: localize('workbench.action.terminal.openWorkingDirectory', "Open working directory"), original: 'Open working directory' },
				f1: true,
				category,
				precondition: ContextKeyExpr.and(ContextKeyExpr.or(TerminalContextKeys.processSupported, TerminalContextKeys.terminalHasBeenCreated), TerminalContextKeys.isOpen)
				// keybinding: {
				// 	primary: KeyMod.Alt | KeyCode.KeyZ,
				// 	weight: KeybindingWeight.WorkbenchContrib,
				// 	when: TerminalContextKeys.focus
				// }
			});
		}
		async run(accessor: ServicesAccessor) {
			//const cwd = await (await accessor.get(ITerminalService).activeInstance).getCwd();
			const cwd = await (await accessor.get(ITerminalService).getActiveOrCreateInstance()).getCwd();
			const nativeHostService = await accessor.get(INativeHostService);
			const cwd_uri = URI.file(cwd);
			await nativeHostService.showItemInFolder(cwd_uri.fsPath);
		}
	});
}
