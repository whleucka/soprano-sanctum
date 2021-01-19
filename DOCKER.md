# Soprano Docker

## Install

Linux:

1. Install the containers

```
sudo docker-compose up
```

2. Register a user by visiting http://localhost/register

3. Use tinker to set yourself as admin

```
sudo docker-compose exec app php tinker
> $user = User::find(1);
> $user->is_admin = 1;
> $user->save();
> exit;
```

4. Enjoy! :)
