import { GeneratorService } from './generator.service';
import { ValidationService } from './validation.service';

import { DefaultSrcPath } from './constants';

class GenerateModuleCommand {
	constructor(private $errors: IErrors,
		private $logger: ILogger,
		private $generatorService: GeneratorService,
		private $validationService: ValidationService) {
	}

	canExecute(args: string[]) {
		return new Promise((resolve, reject) => {

			if (this.$validationService.isAngularNativeScriptProject() === false) {
				this.$errors.failWithoutHelp('Angular NativeScript project not found at the current location.');
			}

			if (args.length !== 1) {
				this.$errors.failWithoutHelp('This command requires one argument.');
			}

			if (this.$validationService.checkIfModuleExists(DefaultSrcPath.NATIVESCRIPT, args[0])) {
				this.$errors.failWithoutHelp(`${args[0]} module already exists`);
			}

			resolve(true);
		});
	}

	execute(args: string[]) {
		return new Promise((resolve, reject) => {
			const message = this.generateModule(args[0]);
			this.$logger.printMarkdown(message);

			resolve();
		});
	}

	public generateModule(name: string): string {
		return this.$generatorService.generate(name, 'module', DefaultSrcPath.NATIVESCRIPT);
	}
}

$injector.registerCommand([
	'generate|module',
	'g|module',
	'generate|m',
	'g|m'
], GenerateModuleCommand);
