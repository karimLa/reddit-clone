import { MikroORM } from '@mikro-orm/core';
import mikroOrmConfig from './mikro-orm.config';
import { Post } from './entities/Post';

async function main() {
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up();

  const posts = await orm.em.find(Post, {});
  console.log(posts);
}

main().catch(console.error);
