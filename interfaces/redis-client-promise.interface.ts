import {Callback, ClientOpts, Multi, RedisClient, ServerInfo} from "redis";

export interface IRedisClientPromise extends RedisCommands<any>{

}


export interface RedisCommands<R>{
    duplicate(options?: ClientOpts): Promise<RedisClient>;

    sendCommand(command: string): Promise<any>;

    sendCommand(command: string, args?: any[]): Promise<any>;

    send_command(command: string): Promise<any>;

    send_command(command: string, args?: any[]): Promise<any>;

    addCommand(command: string): void;

    add_command(command: string): void;

    /**
     * Mark the start of a transaction block.
     */
    multi(args?: Array<Array<string | number>>): Multi;

    MULTI(args?: Array<Array<string | number>>): Multi;

    batch(args?: Array<Array<string | number>>): Multi;

    BATCH(args?: Array<Array<string | number>>): Multi;

    /**
     * Listen for all requests received by the server in real time.
     */
    monitor(): Promise<undefined>;

    MONITOR(): Promise<undefined>;

    /**
     * Get information and statistics about the server.
     */
    info(): Promise<ServerInfo>;

    info(section?: string | string[]): Promise<ServerInfo>;

    INFO(): Promise<ServerInfo>;

    INFO(section?: string | string[]): Promise<ServerInfo>;

    /**
     * Ping the server.
     */
    ping(): Promise<string>;

    ping(message: string,): Promise<string>;

    PING(): Promise<string>;

    PING(message: string,): Promise<string>;

    /**
     * Post a message to a channel.
     */
    publish(channel: string, value: string): Promise<number>;

    PUBLISH(channel: string, value: string): Promise<number>;

    /**
     * Authenticate to the server.
     */
    auth(password: string,): Promise<string>;

    AUTH(password: string,): Promise<string>;

    /**
     * KILL - Kill the connection of a client.
     * LIST - Get the list of client connections.
     * GETNAME - Get the current connection name.
     * PAUSE - Stop processing commands from clients for some time.
     * REPLY - Instruct the server whether to reply to commands.
     * SETNAME - Set the current connection name.
     */
    client: OverloadedCommand<string, any, R>;
    CLIENT: OverloadedCommand<string, any, R>;

    /**
     * Set multiple hash fields to multiple values.
     */
    hmset: OverloadedSetCommand<string | number, boolean, R>;
    HMSET: OverloadedSetCommand<string | number, boolean, R>;

    /**
     * Listen for messages published to the given channels.
     */
    subscribe: OverloadedListCommand<string, string, R>;
    SUBSCRIBE: OverloadedListCommand<string, string, R>;

    /**
     * Stop listening for messages posted to the given channels.
     */
    unsubscribe: OverloadedListCommand<string, string, R>;
    UNSUBSCRIBE: OverloadedListCommand<string, string, R>;

    /**
     * Listen for messages published to channels matching the given patterns.
     */
    psubscribe: OverloadedListCommand<string, string, R>;
    PSUBSCRIBE: OverloadedListCommand<string, string, R>;

    /**
     * Stop listening for messages posted to channels matching the given patterns.
     */
    punsubscribe: OverloadedListCommand<string, string, R>;
    PUNSUBSCRIBE: OverloadedListCommand<string, string, R>;

    /**
     * Append a value to a key.
     */
    append(key: string, value: string): Promise<number>;

    APPEND(key: string, value: string): Promise<number>;

    /**
     * Asynchronously rewrite the append-only file.
     */
    bgrewriteaof(): Promise<'OK'>;

    BGREWRITEAOF(): Promise<'OK'>;

    /**
     * Asynchronously save the dataset to disk.
     */
    bgsav: Promise<string>;

    BGSAV: Promise<string>;

    /**
     * Count set bits in a string.
     */
    bitcount(key: string): Promise<number>;

    bitcount(key: string, start: number, end: number): Promise<number>;

    BITCOUNT(key: string): Promise<number>;

    BITCOUNT(key: string, start: number, end: number): Promise<number>;

    /**
     * Perform arbitrary bitfield integer operations on strings.
     */
    bitfield: OverloadedKeyCommand<string | number, [number, number], R>;
    BITFIELD: OverloadedKeyCommand<string | number, [number, number], R>;

    /**
     * Perform bitwise operations between strings.
     */
    bitop(operation: string, destkey: string, key1: string, key2: string, key3: string): Promise<number>;

    bitop(operation: string, destkey: string, key1: string, key2: string): Promise<number>;

    bitop(operation: string, destkey: string, key: string): Promise<number>;

    bitop(operation: string, destkey: string, ...args: Array<string | Callback<number>>): R;

    BITOP(operation: string, destkey: string, key1: string, key2: string, key3: string): Promise<number>;

    BITOP(operation: string, destkey: string, key1: string, key2: string): Promise<number>;

    BITOP(operation: string, destkey: string, key: string): Promise<number>;

    BITOP(operation: string, destkey: string, ...args: Array<string | Callback<number>>): R;

    /**
     * Find first bit set or clear in a string.
     */
    bitpos(key: string, bit: number, start: number, end: number): Promise<number>;

    bitpos(key: string, bit: number, start: number): Promise<number>;

    bitpos(key: string, bit: number): Promise<number>;

    BITPOS(key: string, bit: number, start: number, end: number): Promise<number>;

    BITPOS(key: string, bit: number, start: number): Promise<number>;

    BITPOS(key: string, bit: number): Promise<number>;

    /**
     * Remove and get the first element in a list, or block until one is available.
     */
    blpop: OverloadedLastCommand<string, number, [string, string], R>;
    BLPOP: OverloadedLastCommand<string, number, [string, string], R>;

    /**
     * Remove and get the last element in a list, or block until one is available.
     */
    brpop: OverloadedLastCommand<string, number, [string, string], R>;
    BRPOP: OverloadedLastCommand<string, number, [string, string], R>;

    /**
     * Pop a value from a list, push it to another list and return it; or block until one is available.
     */
    brpoplpush(source: string, destination: string, timeout: number): Promise<string | null>;

    BRPOPLPUSH(source: string, destination: string, timeout: number): Promise<string | null>;

    /**
     * ADDSLOTS - Assign new hash slots to receiving node.
     * COUNT-FAILURE-REPORTS - Return the number of failure reports active for a given node.
     * COUNTKEYSINSLOT - Return the number of local keys in the specified hash slot.
     * DELSLOTS - Set hash slots as unbound in receiving node.
     * FAILOVER - Forces a slave to perform a manual failover of its master.
     * FORGET - Remove a node from the nodes table.
     * GETKEYSINSLOT - Return local key names in the specified hash slot.
     * INFO - Provides info about Redis Cluster node state.
     * KEYSLOT - Returns the hash slot of the specified key.
     * MEET - Force a node cluster to handshake with another node.
     * NODES - Get cluster config for the node.
     * REPLICATE - Reconfigure a node as a slave of the specified master node.
     * RESET - Reset a Redis Cluster node.
     * SAVECONFIG - Forces the node to save cluster state on disk.
     * SET-CONFIG-EPOCH - Set the configuration epoch in a new node.
     * SETSLOT - Bind a hash slot to a specified node.
     * SLAVES - List slave nodes of the specified master node.
     * SLOTS - Get array of Cluster slot to node mappings.
     */
    cluster: OverloadedCommand<string, any, this>;
    CLUSTER: OverloadedCommand<string, any, this>;

    /**
     * Get array of Redis command details.
     *
     * COUNT - Get total number of Redis commands.
     * GETKEYS - Extract keys given a full Redis command.
     * INFO - Get array of specific REdis command details.
     */
    command(): Promise<Array<[string, number, string[], number, number, number]>>;

    COMMAND(): Promise<Array<[string, number, string[], number, number, number]>>;

    /**
     * Get array of Redis command details.
     *
     * COUNT - Get array of Redis command details.
     * GETKEYS - Extract keys given a full Redis command.
     * INFO - Get array of specific Redis command details.
     * GET - Get the value of a configuration parameter.
     * REWRITE - Rewrite the configuration file with the in memory configuration.
     * SET - Set a configuration parameter to the given value.
     * RESETSTAT - Reset the stats returned by INFO.
     */
    config: OverloadedCommand<string, boolean, R>;
    CONFIG: OverloadedCommand<string, boolean, R>;

    /**
     * Return the number of keys in the selected database.
     */
    dbsiz: Promise<number>;

    DBSIZ: Promise<number>;

    /**
     * OBJECT - Get debugging information about a key.
     * SEGFAULT - Make the server crash.
     */
    debug: OverloadedCommand<string, boolean, R>;
    DEBUG: OverloadedCommand<string, boolean, R>;

    /**
     * Decrement the integer value of a key by one.
     */
    decr(key: string): Promise<number>;

    DECR(key: string): Promise<number>;

    /**
     * Decrement the integer value of a key by the given number.
     */
    decrby(key: string, decrement: number): Promise<number>;

    DECRBY(key: string, decrement: number): Promise<number>;

    /**
     * Delete a key.
     */
    del: OverloadedCommand<string, number, R>;
    DEL: OverloadedCommand<string, number, R>;

    /**
     * Discard all commands issued after MULTI.
     */
    discard(): Promise<'OK'>;

    DISCARD(): Promise<'OK'>;

    /**
     * Return a serialized version of the value stored at the specified key.
     */
    dump(key: string): Promise<string>;

    DUMP(key: string): Promise<string>;

    /**
     * Echo the given string.
     */
    echo<T extends string>(message: T): Promise<T>;

    ECHO<T extends string>(message: T): Promise<T>;

    /**
     * Execute a Lua script server side.
     */
    eval: OverloadedCommand<string | number, any, R>;
    EVAL: OverloadedCommand<string | number, any, R>;

    /**
     * Execute a Lue script server side.
     */
    evalsha: OverloadedCommand<string | number, any, R>;
    EVALSHA: OverloadedCommand<string | number, any, R>;

    /**
     * Determine if a key exists.
     */
    exists: OverloadedCommand<string, number, R>;
    EXISTS: OverloadedCommand<string, number, R>;

    /**
     * Set a key's time to live in seconds.
     */
    expire(key: string, seconds: number): Promise<number>;

    EXPIRE(key: string, seconds: number): Promise<number>;

    /**
     * Set the expiration for a key as a UNIX timestamp.
     */
    expireat(key: string, timestamp: number): Promise<number>;

    EXPIREAT(key: string, timestamp: number): Promise<number>;

    /**
     * Remove all keys from all databases.
     */
    flushal: Promise<string>;

    FLUSHAL: Promise<string>;

    /**
     * Remove all keys from the current database.
     */
    flushd: Promise<string>;

    FLUSHD: Promise<string>;

    /**
     * Add one or more geospatial items in the geospatial index represented using a sorted set.
     */
    geoadd: OverloadedKeyCommand<string | number, number, R>;
    GEOADD: OverloadedKeyCommand<string | number, number, R>;

    /**
     * Returns members of a geospatial index as standard geohash strings.
     */
    geohash: OverloadedKeyCommand<string, string, R>;
    GEOHASH: OverloadedKeyCommand<string, string, R>;

    /**
     * Returns longitude and latitude of members of a geospatial index.
     */
    geopos: OverloadedKeyCommand<string, Array<[number, number]>, R>;
    GEOPOS: OverloadedKeyCommand<string, Array<[number, number]>, R>;

    /**
     * Returns the distance between two members of a geospatial index.
     */
    geodist: OverloadedKeyCommand<string, string, R>;
    GEODIST: OverloadedKeyCommand<string, string, R>;

    /**
     * Query a sorted set representing a geospatial index to fetch members matching a given maximum distance from a point.
     */
    georadius: OverloadedKeyCommand<string | number, Array<string | [string, string | [string, string]]>, R>;
    GEORADIUS: OverloadedKeyCommand<string | number, Array<string | [string, string | [string, string]]>, R>;

    /**
     * Query a sorted set representing a geospatial index to fetch members matching a given maximum distance from a member.
     */
    georadiusbymember: OverloadedKeyCommand<string | number, Array<string | [string, string | [string, string]]>, R>;
    GEORADIUSBYMEMBER: OverloadedKeyCommand<string | number, Array<string | [string, string | [string, string]]>, R>;

    /**
     * Get the value of a key.
     */
    get(key: string): Promise<string>;

    GET(key: string): Promise<string>;

    /**
     * Returns the bit value at offset in the string value stored at key.
     */
    getbit(key: string, offset: number): Promise<number>;

    GETBIT(key: string, offset: number): Promise<number>;

    /**
     * Get a substring of the string stored at a key.
     */
    getrange(key: string, start: number, end: number): Promise<string>;

    GETRANGE(key: string, start: number, end: number): Promise<string>;

    /**
     * Set the string value of a key and return its old value.
     */
    getset(key: string, value: string): Promise<string>;

    GETSET(key: string, value: string): Promise<string>;

    /**
     * Delete on or more hash fields.
     */
    hdel: OverloadedKeyCommand<string, number, R>;
    HDEL: OverloadedKeyCommand<string, number, R>;

    /**
     * Determine if a hash field exists.
     */
    hexists(key: string, field: string): Promise<number>;

    HEXISTS(key: string, field: string): Promise<number>;

    /**
     * Get the value of a hash field.
     */
    hget(key: string, field: string): Promise<string>;

    HGET(key: string, field: string): Promise<string>;

    /**
     * Get all fields and values in a hash.
     */
    hgetall(key: string): Promise<{ [key: string]: string }>;

    HGETALL(key: string): Promise<{ [key: string]: string }>;

    /**
     * Increment the integer value of a hash field by the given number.
     */
    hincrby(key: string, field: string, increment: number): Promise<number>;

    HINCRBY(key: string, field: string, increment: number): Promise<number>;

    /**
     * Increment the float value of a hash field by the given amount.
     */
    hincrbyfloat(key: string, field: string, increment: number): Promise<number>;

    HINCRBYFLOAT(key: string, field: string, increment: number): Promise<number>;

    /**
     * Get all the fields of a hash.
     */
    hkeys(key: string): Promise<string[]>;

    HKEYS(key: string): Promise<string[]>;

    /**
     * Get the number of fields in a hash.
     */
    hlen(key: string): Promise<number>;

    HLEN(key: string): Promise<number>;

    /**
     * Get the values of all the given hash fields.
     */
    hmget: OverloadedKeyCommand<string, string[], R>;
    HMGET: OverloadedKeyCommand<string, string[], R>;

    /**
     * Set the string value of a hash field.
     */
    hset(key: string, field: string, value: string): Promise<number>;

    HSET(key: string, field: string, value: string): Promise<number>;

    /**
     * Set the value of a hash field, only if the field does not exist.
     */
    hsetnx(key: string, field: string, value: string): Promise<number>;

    HSETNX(key: string, field: string, value: string): Promise<number>;

    /**
     * Get the length of the value of a hash field.
     */
    hstrlen(key: string, field: string): Promise<number>;

    HSTRLEN(key: string, field: string): Promise<number>;

    /**
     * Get all the values of a hash.
     */
    hvals(key: string): Promise<string[]>;

    HVALS(key: string): Promise<string[]>;

    /**
     * Increment the integer value of a key by one.
     */
    incr(key: string): Promise<number>;

    INCR(key: string): Promise<number>;

    /**
     * Increment the integer value of a key by the given amount.
     */
    incrby(key: string, increment: number): Promise<number>;

    INCRBY(key: string, increment: number): Promise<number>;

    /**
     * Increment the float value of a key by the given amount.
     */
    incrbyfloat(key: string, increment: number): Promise<number>;

    INCRBYFLOAT(key: string, increment: number): Promise<number>;

    /**
     * Find all keys matching the given pattern.
     */
    keys(pattern: string): Promise<string[]>;

    KEYS(pattern: string): Promise<string[]>;

    /**
     * Get the UNIX time stamp of the last successful save to disk.
     */
    lastsav: Promise<number>;

    LASTSAV: Promise<number>;

    /**
     * Get an element from a list by its index.
     */
    lindex(key: string, index: number): Promise<string>;

    LINDEX(key: string, index: number): Promise<string>;

    /**
     * Insert an element before or after another element in a list.
     */
    linsert(key: string, dir: 'BEFORE' | 'AFTER', pivot: string, value: string): Promise<string>;

    LINSERT(key: string, dir: 'BEFORE' | 'AFTER', pivot: string, value: string): Promise<string>;

    /**
     * Get the length of a list.
     */
    llen(key: string): Promise<number>;

    LLEN(key: string): Promise<number>;

    /**
     * Remove and get the first element in a list.
     */
    lpop(key: string): Promise<string>;

    LPOP(key: string): Promise<string>;

    /**
     * Prepend one or multiple values to a list.
     */
    lpush: OverloadedKeyCommand<string, number, R>;
    LPUSH: OverloadedKeyCommand<string, number, R>;

    /**
     * Prepend a value to a list, only if the list exists.
     */
    lpushx(key: string, value: string): Promise<number>;

    LPUSHX(key: string, value: string): Promise<number>;

    /**
     * Get a range of elements from a list.
     */
    lrange(key: string, start: number, stop: number): Promise<string[]>;

    LRANGE(key: string, start: number, stop: number): Promise<string[]>;

    /**
     * Remove elements from a list.
     */
    lrem(key: string, count: number, value: string): Promise<number>;

    LREM(key: string, count: number, value: string): Promise<number>;

    /**
     * Set the value of an element in a list by its index.
     */
    lset(key: string, index: number, value: string, ): Promise<'OK'>;

    LSET(key: string, index: number, value: string, ): Promise<'OK'>;

    /**
     * Trim a list to the specified range.
     */
    ltrim(key: string, start: number, stop: number, ): Promise<'OK'>;

    LTRIM(key: string, start: number, stop: number, ): Promise<'OK'>;

    /**
     * Get the values of all given keys.
     */
    mget: OverloadedCommand<string, string[], R>;
    MGET: OverloadedCommand<string, string[], R>;

    /**
     * Atomically tranfer a key from a Redis instance to another one.
     */
    migrate: OverloadedCommand<string, boolean, R>;
    MIGRATE: OverloadedCommand<string, boolean, R>;

    /**
     * Move a key to another database.
     */
    move(key: string, db: string | number): R;

    MOVE(key: string, db: string | number): R;

    /**
     * Set multiple keys to multiple values.
     */
    mset: OverloadedCommand<string, boolean, R>;
    MSET: OverloadedCommand<string, boolean, R>;

    /**
     * Set multiple keys to multiple values, only if none of the keys exist.
     */
    msetnx: OverloadedCommand<string, boolean, R>;
    MSETNX: OverloadedCommand<string, boolean, R>;

    /**
     * Inspect the internals of Redis objects.
     */
    object: OverloadedCommand<string, any, R>;
    OBJECT: OverloadedCommand<string, any, R>;

    /**
     * Remove the expiration from a key.
     */
    persist(key: string): Promise<number>;

    PERSIST(key: string): Promise<number>;

    /**
     * Remove a key's time to live in milliseconds.
     */
    pexpire(key: string, milliseconds: number): Promise<number>;

    PEXPIRE(key: string, milliseconds: number): Promise<number>;

    /**
     * Set the expiration for a key as a UNIX timestamp specified in milliseconds.
     */
    pexpireat(key: string, millisecondsTimestamp: number): Promise<number>;

    PEXPIREAT(key: string, millisecondsTimestamp: number): Promise<number>;

    /**
     * Adds the specified elements to the specified HyperLogLog.
     */
    pfadd: OverloadedKeyCommand<string, number, R>;
    PFADD: OverloadedKeyCommand<string, number, R>;

    /**
     * Return the approximated cardinality of the set(s) observed by the HyperLogLog at key(s).
     */
    pfcount: OverloadedCommand<string, number, R>;
    PFCOUNT: OverloadedCommand<string, number, R>;

    /**
     * Merge N different HyperLogLogs into a single one.
     */
    pfmerge: OverloadedCommand<string, boolean, R>;
    PFMERGE: OverloadedCommand<string, boolean, R>;

    /**
     * Set the value and expiration in milliseconds of a key.
     */
    psetex(key: string, milliseconds: number, value: string, ): Promise<'OK'>;

    PSETEX(key: string, milliseconds: number, value: string, ): Promise<'OK'>;

    /**
     * Inspect the state of the Pub/Sub subsytem.
     */
    pubsub: OverloadedCommand<string, number, R>;
    PUBSUB: OverloadedCommand<string, number, R>;

    /**
     * Get the time to live for a key in milliseconds.
     */
    pttl(key: string): Promise<number>;

    PTTL(key: string): Promise<number>;

    /**
     * Close the connection.
     */
    quit(): Promise<'OK'>;

    QUIT(): Promise<'OK'>;

    /**
     * Return a random key from the keyspace.
     */
    randomke: Promise<string>;

    RANDOMKE: Promise<string>;

    /**
     * Enables read queries for a connection to a cluster slave node.
     */
    readonl: Promise<string>;

    READONL: Promise<string>;

    /**
     * Disables read queries for a connection to cluster slave node.
     */
    readwrit: Promise<string>;

    READWRIT: Promise<string>;

    /**
     * Rename a key.
     */
    rename(key: string, newkey: string, ): Promise<'OK'>;

    RENAME(key: string, newkey: string, ): Promise<'OK'>;

    /**
     * Rename a key, only if the new key does not exist.
     */
    renamenx(key: string, newkey: string): Promise<number>;

    RENAMENX(key: string, newkey: string): Promise<number>;

    /**
     * Create a key using the provided serialized value, previously obtained using DUMP.
     */
    restore(key: string, ttl: number, serializedValue: string, ): Promise<'OK'>;

    RESTORE(key: string, ttl: number, serializedValue: string, ): Promise<'OK'>;

    /**
     * Return the role of the instance in the context of replication.
     */
    role(): Promise<[string, number, Array<[string, string, string]>]>;

    ROLE(): Promise<[string, number, Array<[string, string, string]>]>;

    /**
     * Remove and get the last element in a list.
     */
    rpop(key: string): Promise<string>;

    RPOP(key: string): Promise<string>;

    /**
     * Remove the last element in a list, prepend it to another list and return it.
     */
    rpoplpush(source: string, destination: string): Promise<string>;

    RPOPLPUSH(source: string, destination: string): Promise<string>;

    /**
     * Append one or multiple values to a list.
     */
    rpush: OverloadedKeyCommand<string, number, R>;
    RPUSH: OverloadedKeyCommand<string, number, R>;

    /**
     * Append a value to a list, only if the list exists.
     */
    rpushx(key: string, value: string): Promise<number>;

    RPUSHX(key: string, value: string): Promise<number>;

    /**
     * Append one or multiple members to a set.
     */
    sadd: OverloadedKeyCommand<string, number, R>;
    SADD: OverloadedKeyCommand<string, number, R>;

    /**
     * Synchronously save the dataset to disk.
     */
    sav: Promise<string>;

    SAV: Promise<string>;

    /**
     * Get the number of members in a set.
     */
    scard(key: string): Promise<number>;

    SCARD(key: string): Promise<number>;

    /**
     * DEBUG - Set the debug mode for executed scripts.
     * EXISTS - Check existence of scripts in the script cache.
     * FLUSH - Remove all scripts from the script cache.
     * KILL - Kill the script currently in execution.
     * LOAD - Load the specified Lua script into the script cache.
     */
    script: OverloadedCommand<string, any, R>;
    SCRIPT: OverloadedCommand<string, any, R>;

    /**
     * Subtract multiple sets.
     */
    sdiff: OverloadedCommand<string, string[], R>;
    SDIFF: OverloadedCommand<string, string[], R>;

    /**
     * Subtract multiple sets and store the resulting set in a key.
     */
    sdiffstore: OverloadedKeyCommand<string, number, R>;
    SDIFFSTORE: OverloadedKeyCommand<string, number, R>;

    /**
     * Change the selected database for the current connection.
     */
    select(index: number | string): Promise<string>;

    SELECT(index: number | string): Promise<string>;

    /**
     * Set the string value of a key.
     */
    set(key: string, value: string, ): Promise<'OK'>;

    set(key: string, value: string, flag: string, ): Promise<'OK'>;

    set(key: string, value: string, mode: string, duration: number): Promise<'OK' | undefined>;

    set(key: string, value: string, mode: string, duration: number, flag: string): Promise<'OK' | undefined>;

    SET(key: string, value: string, ): Promise<'OK'>;

    SET(key: string, value: string, flag: string, ): Promise<'OK'>;

    SET(key: string, value: string, mode: string, duration: number): Promise<'OK' | undefined>;

    SET(key: string, value: string, mode: string, duration: number, flag: string): Promise<'OK' | undefined>;

    /**
     * Sets or clears the bit at offset in the string value stored at key.
     */
    setbit(key: string, offset: number, value: string): Promise<number>;

    SETBIT(key: string, offset: number, value: string): Promise<number>;

    /**
     * Set the value and expiration of a key.
     */
    setex(key: string, seconds: number, value: string): Promise<string>;

    SETEX(key: string, seconds: number, value: string): Promise<string>;

    /**
     * Set the value of a key, only if the key does not exist.
     */
    setnx(key: string, value: string): Promise<number>;

    SETNX(key: string, value: string): Promise<number>;

    /**
     * Overwrite part of a string at key starting at the specified offset.
     */
    setrange(key: string, offset: number, value: string): Promise<number>;

    SETRANGE(key: string, offset: number, value: string): Promise<number>;

    /**
     * Synchronously save the dataset to disk and then shut down the server.
     */
    shutdown: OverloadedCommand<string, string, R>;
    SHUTDOWN: OverloadedCommand<string, string, R>;

    /**
     * Intersect multiple sets.
     */
    sinter: OverloadedKeyCommand<string, string[], R>;
    SINTER: OverloadedKeyCommand<string, string[], R>;

    /**
     * Intersect multiple sets and store the resulting set in a key.
     */
    sinterstore: OverloadedCommand<string, number, R>;
    SINTERSTORE: OverloadedCommand<string, number, R>;

    /**
     * Determine if a given value is a member of a set.
     */
    sismember(key: string, member: string): Promise<number>;

    SISMEMBER(key: string, member: string): Promise<number>;

    /**
     * Make the server a slave of another instance, or promote it as master.
     */
    slaveof(host: string, port: string | number): Promise<string>;

    SLAVEOF(host: string, port: string | number): Promise<string>;

    /**
     * Manages the Redis slow queries log.
     */
    slowlog: OverloadedCommand<string, Array<[number, number, number, string[]]>, R>;
    SLOWLOG: OverloadedCommand<string, Array<[number, number, number, string[]]>, R>;

    /**
     * Get all the members in a set.
     */
    smembers(key: string): Promise<string[]>;

    SMEMBERS(key: string): Promise<string[]>;

    /**
     * Move a member from one set to another.
     */
    smove(source: string, destination: string, member: string): Promise<number>;

    SMOVE(source: string, destination: string, member: string): Promise<number>;

    /**
     * Sort the elements in a list, set or sorted set.
     */
    sort: OverloadedCommand<string, string[], R>;
    SORT: OverloadedCommand<string, string[], R>;

    /**
     * Remove and return one or multiple random members from a set.
     */
    spop(key: string): Promise<string>;

    spop(key: string, count: number): Promise<string[]>;

    SPOP(key: string): Promise<string>;

    SPOP(key: string, count: number): Promise<string[]>;

    /**
     * Get one or multiple random members from a set.
     */
    srandmember(key: string): Promise<string>;

    srandmember(key: string, count: number): Promise<string[]>;

    SRANDMEMBER(key: string): Promise<string>;

    SRANDMEMBER(key: string, count: number): Promise<string[]>;

    /**
     * Remove one or more members from a set.
     */
    srem: OverloadedKeyCommand<string, number, R>;
    SREM: OverloadedKeyCommand<string, number, R>;

    /**
     * Get the length of the value stored in a key.
     */
    strlen(key: string): Promise<number>;

    STRLEN(key: string): Promise<number>;

    /**
     * Add multiple sets.
     */
    sunion: OverloadedCommand<string, string[], R>;
    SUNION: OverloadedCommand<string, string[], R>;

    /**
     * Add multiple sets and store the resulting set in a key.
     */
    sunionstore: OverloadedCommand<string, number, R>;
    SUNIONSTORE: OverloadedCommand<string, number, R>;

    /**
     * Internal command used for replication.
     */
    sync(): Promise<undefined>;

    SYNC(): Promise<undefined>;

    /**
     * Return the current server time.
     */
    time(): Promise<[string, string]>;

    TIME(): Promise<[string, string]>;

    /**
     * Get the time to live for a key.
     */
    ttl(key: string): Promise<number>;

    TTL(key: string): Promise<number>;

    /**
     * Determine the type stored at key.
     */
    type(key: string): Promise<string>;

    TYPE(key: string): Promise<string>;

    /**
     * Forget about all watched keys.
     */
    unwatch(): Promise<'OK'>;

    UNWATCH(): Promise<'OK'>;

    /**
     * Wait for the synchronous replication of all the write commands sent in the context of the current connection.
     */
    wait(numslaves: number, timeout: number): Promise<number>;

    WAIT(numslaves: number, timeout: number): Promise<number>;

    /**
     * Watch the given keys to determine execution of the MULTI/EXEC block.
     */
    watch: OverloadedCommand<string, 'OK', R>;
    WATCH: OverloadedCommand<string, 'OK', R>;

    /**
     * Add one or more members to a sorted set, or update its score if it already exists.
     */
    zadd: OverloadedKeyCommand<string | number, number, R>;
    ZADD: OverloadedKeyCommand<string | number, number, R>;

    /**
     * Get the number of members in a sorted set.
     */
    zcard(key: string): Promise<number>;

    ZCARD(key: string): Promise<number>;

    /**
     * Count the members in a sorted set with scores between the given values.
     */
    zcount(key: string, min: number | string, max: number | string): Promise<number>;

    ZCOUNT(key: string, min: number | string, max: number | string): Promise<number>;

    /**
     * Increment the score of a member in a sorted set.
     */
    zincrby(key: string, increment: number, member: string): Promise<number>;

    ZINCRBY(key: string, increment: number, member: string): Promise<number>;

    /**
     * Intersect multiple sorted sets and store the resulting sorted set in a new key.
     */
    zinterstore: OverloadedCommand<string | number, number, R>;
    ZINTERSTORE: OverloadedCommand<string | number, number, R>;

    /**
     * Count the number of members in a sorted set between a given lexicographic range.
     */
    zlexcount(key: string, min: string, max: string): Promise<number>;

    ZLEXCOUNT(key: string, min: string, max: string): Promise<number>;

    /**
     * Return a range of members in a sorted set, by index.
     */
    zrange(key: string, start: number, stop: number): Promise<string[]>;

    zrange(key: string, start: number, stop: number, withscores: string): Promise<string[]>;

    ZRANGE(key: string, start: number, stop: number): Promise<string[]>;

    ZRANGE(key: string, start: number, stop: number, withscores: string): Promise<string[]>;

    /**
     * Return a range of members in a sorted set, by lexicographical range.
     */
    zrangebylex(key: string, min: string, max: string): Promise<string[]>;

    zrangebylex(key: string, min: string, max: string, limit: string, offset: number, count: number): Promise<string[]>;

    ZRANGEBYLEX(key: string, min: string, max: string): Promise<string[]>;

    ZRANGEBYLEX(key: string, min: string, max: string, limit: string, offset: number, count: number): Promise<string[]>;

    /**
     * Return a range of members in a sorted set, by lexicographical range, ordered from higher to lower strings.
     */
    zrevrangebylex(key: string, min: string, max: string): Promise<string[]>;

    zrevrangebylex(key: string, min: string, max: string, limit: string, offset: number, count: number): Promise<string[]>;

    ZREVRANGEBYLEX(key: string, min: string, max: string): Promise<string[]>;

    ZREVRANGEBYLEX(key: string, min: string, max: string, limit: string, offset: number, count: number): Promise<string[]>;

    /**
     * Return a range of members in a sorted set, by score.
     */
    zrangebyscore(key: string, min: number | string, max: number | string): Promise<string[]>;

    zrangebyscore(key: string, min: number | string, max: number | string, withscores: string): Promise<string[]>;

    zrangebyscore(key: string, min: number | string, max: number | string, limit: string, offset: number, count: number): Promise<string[]>;

    zrangebyscore(key: string, min: number | string, max: number | string, withscores: string, limit: string, offset: number, count: number): Promise<string[]>;

    ZRANGEBYSCORE(key: string, min: number | string, max: number | string): Promise<string[]>;

    ZRANGEBYSCORE(key: string, min: number | string, max: number | string, withscores: string): Promise<string[]>;

    ZRANGEBYSCORE(key: string, min: number | string, max: number | string, limit: string, offset: number, count: number): Promise<string[]>;

    ZRANGEBYSCORE(key: string, min: number | string, max: number | string, withscores: string, limit: string, offset: number, count: number): Promise<string[]>;

    /**
     * Determine the index of a member in a sorted set.
     */
    zrank(key: string, member: string): Promise<number | undefined>;

    ZRANK(key: string, member: string): Promise<number | undefined>;

    /**
     * Remove one or more members from a sorted set.
     */
    zrem: OverloadedKeyCommand<string, number, R>;
    ZREM: OverloadedKeyCommand<string, number, R>;

    /**
     * Remove all members in a sorted set between the given lexicographical range.
     */
    zremrangebylex(key: string, min: string, max: string): Promise<number>;

    ZREMRANGEBYLEX(key: string, min: string, max: string): Promise<number>;

    /**
     * Remove all members in a sorted set within the given indexes.
     */
    zremrangebyrank(key: string, start: number, stop: number): Promise<number>;

    ZREMRANGEBYRANK(key: string, start: number, stop: number): Promise<number>;

    /**
     * Remove all members in a sorted set within the given indexes.
     */
    zremrangebyscore(key: string, min: string | number, max: string | number): Promise<number>;

    ZREMRANGEBYSCORE(key: string, min: string | number, max: string | number): Promise<number>;

    /**
     * Return a range of members in a sorted set, by index, with scores ordered from high to low.
     */
    zrevrange(key: string, start: number, stop: number): Promise<string[]>;

    zrevrange(key: string, start: number, stop: number, withscores: string): Promise<string[]>;

    ZREVRANGE(key: string, start: number, stop: number): Promise<string[]>;

    ZREVRANGE(key: string, start: number, stop: number, withscores: string): Promise<string[]>;

    /**
     * Return a range of members in a sorted set, by score, with scores ordered from high to low.
     */
    zrevrangebyscore(key: string, min: number | string, max: number | string): Promise<string[]>;

    zrevrangebyscore(key: string, min: number | string, max: number | string, withscores: string): Promise<string[]>;

    zrevrangebyscore(key: string, min: number | string, max: number | string, limit: string, offset: number, count: number): Promise<string[]>;

    zrevrangebyscore(key: string, min: number | string, max: number | string, withscores: string, limit: string, offset: number, count: number): Promise<string[]>;

    ZREVRANGEBYSCORE(key: string, min: number | string, max: number | string): Promise<string[]>;

    ZREVRANGEBYSCORE(key: string, min: number | string, max: number | string, withscores: string): Promise<string[]>;

    ZREVRANGEBYSCORE(key: string, min: number | string, max: number | string, limit: string, offset: number, count: number): Promise<string[]>;

    ZREVRANGEBYSCORE(key: string, min: number | string, max: number | string, withscores: string, limit: string, offset: number, count: number): Promise<string[]>;

    /**
     * Determine the index of a member in a sorted set, with scores ordered from high to low.
     */
    zrevrank(key: string, member: string): Promise<number | undefined>;

    ZREVRANK(key: string, member: string): Promise<number | undefined>;

    /**
     * Get the score associated with the given member in a sorted set.
     */
    zscore(key: string, member: string): Promise<string>;

    ZSCORE(key: string, member: string): Promise<string>;

    /**
     * Add multiple sorted sets and store the resulting sorted set in a new key.
     */
    zunionstore: OverloadedCommand<string | number, number, R>;
    ZUNIONSTORE: OverloadedCommand<string | number, number, R>;

    /**
     * Incrementally iterate the keys space.
     */
    scan: OverloadedCommand<string, [string, string[]], R>;
    SCAN: OverloadedCommand<string, [string, string[]], R>;

    /**
     * Incrementally iterate Set elements.
     */
    sscan: OverloadedKeyCommand<string, [string, string[]], R>;
    SSCAN: OverloadedKeyCommand<string, [string, string[]], R>;

    /**
     * Incrementally iterate hash fields and associated values.
     */
    hscan: OverloadedKeyCommand<string, [string, string[]], R>;
    HSCAN: OverloadedKeyCommand<string, [string, string[]], R>;

    /**
     * Incrementally iterate sorted sets elements and associated scores.
     */
    zscan: OverloadedKeyCommand<string, [string, string[]], R>;
    ZSCAN: OverloadedKeyCommand<string, [string, string[]], R>;
}

export interface OverloadedCommand<T, U, R> {
    (arg1: T, arg2: T, arg3: T, arg4: T, arg5: T, arg6: T): Promise<U>;

    (arg1: T, arg2: T, arg3: T, arg4: T, arg5: T): Promise<U>;

    (arg1: T, arg2: T, arg3: T, arg4: T): Promise<U>;

    (arg1: T, arg2: T, arg3: T): Promise<U>;

    (arg1: T, arg2: T | T[]): Promise<U>;

    (arg1: T | T[]): Promise<U>;

    (...args: Array<T>): Promise<U>;
}

export interface OverloadedKeyCommand<T, U, R> {
    (key: string, arg1: T, arg2: T, arg3: T, arg4: T, arg5: T, arg6: T): Promise<U>;

    (key: string, arg1: T, arg2: T, arg3: T, arg4: T, arg5: T): Promise<U>;

    (key: string, arg1: T, arg2: T, arg3: T, arg4: T): Promise<U>;

    (key: string, arg1: T, arg2: T, arg3: T): Promise<U>;

    (key: string, arg1: T, arg2: T): Promise<U>;

    (key: string, arg1: T | T[]): Promise<U>;

    (key: string, ...args: Array<T>): Promise<U>;

    (...args: Array<string | T>): Promise<U>;
}

export interface OverloadedListCommand<T, U, R> {
    (arg1: T, arg2: T, arg3: T, arg4: T, arg5: T, arg6: T): Promise<U>;

    (arg1: T, arg2: T, arg3: T, arg4: T, arg5: T): Promise<U>;

    (arg1: T, arg2: T, arg3: T, arg4: T): Promise<U>;

    (arg1: T, arg2: T, arg3: T): Promise<U>;

    (arg1: T, arg2: T): Promise<U>;

    (arg1: T | T[]): Promise<U>;

    (...args: Array<T>): Promise<U>;
}

export interface OverloadedSetCommand<T, U, R> {
    (key: string, arg1: T, arg2: T, arg3: T, arg4: T, arg5: T, arg6: T): Promise<U>;

    (key: string, arg1: T, arg2: T, arg3: T, arg4: T, arg5: T): Promise<U>;

    (key: string, arg1: T, arg2: T, arg3: T, arg4: T): Promise<U>;

    (key: string, arg1: T, arg2: T, arg3: T): Promise<U>;

    (key: string, arg1: T, arg2: T): Promise<U>;

    (key: string, arg1: T | { [key: string]: T } | T[]): Promise<U>;

    (key: string, ...args: Array<T>): Promise<U>;
}

export interface OverloadedLastCommand<T1, T2, U, R> {
    (arg1: T1, arg2: T1, arg3: T1, arg4: T1, arg5: T1, arg6: T2): Promise<U>;

    (arg1: T1, arg2: T1, arg3: T1, arg4: T1, arg5: T2): Promise<U>;

    (arg1: T1, arg2: T1, arg3: T1, arg4: T2): Promise<U>;

    (arg1: T1, arg2: T1, arg3: T2): Promise<U>;

    (arg1: T1, arg2: T2 | Array<T1 | T2>): Promise<U>;

    (args: Array<T1 | T2>): Promise<U>;

    (...args: Array<T1 | T2>): Promise<U>;
}

