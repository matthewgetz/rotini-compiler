import { Command, } from './cli/command';

const testing = (): void => {
  const command = new Command({
    name: '1',
    description: '1 description',
    aliases: [ 'one', ],
    commands: [
      {
        name: '1.1',
        description: '1.1 description',
        aliases: [ 'one.one', ],
        commands: [
          {
            name: '1.1.1',
            description: '1.1.1 description',
            aliases: [ 'one.one.one', ],
          },
          {
            name: '1.1.2',
            description: '1.1.2 description',
            aliases: [ 'one.one.two', ],
          },
        ],
      },
      {
        name: '1.2',
        description: '1.2 description',
        aliases: [ 'one.two', ],
        commands: [
          {
            name: '1.2.1',
            description: '1.2.1 description',
            aliases: [ 'one.two.one', ],
          },
          {
            name: '1.2.2',
            description: '1.2.2 description',
            aliases: [ 'one.two.two', ],
          },
        ],
      },
    ],
  }, []);

  console.log(JSON.stringify(command, null, 2));
};

testing();
