# diskData
diskData,One repo of boy distribute modality platform. Implement web Intelligent & distribute bussiness-data storage functions to host distributed workflow,bussiness logic DB-service nodes into entire platform's diskData cluster and make them work on same page together.

#license policy
"license": "MPL(Mozilla Public License2.0)"
"comments": "Any unauthoritied using risk won't be charged to current platform developper-boybian. Meanwhile,thanks each every person who pushed this platform to be built"

#Why diskData
1.If you want to host or integrate your distributed database-service nodes into diskData cluster of boyplatform and make them work at same page just like one Database-service,you can use diskData with memory together.
2.If you want to operation your distributed database-service nodes just like a block-chain cluster and execute each every operation after block-chain cluster talking,you can use diskData's block-chain operation feature API.
3.The diskData role of boyplatform just like gum-water of your distributed database-service nodes which may be set under any cloud provider such as AWS,AZURE,Aliyun and so on.

#Current bussiness DB type supported by this micro-service role
MySql,MsSql 


#如何使用[how to use]
1.首先请在你将部署本微服务的容器/虚拟机/IOT下位机中配置安装nodejs环境以及mysql，mysql将作为该微服务的localDB用于微服务运行数据与逻辑数据的存储与处理。
1.First of all, Please install nodejs environment and mysql into the container/virtual machine/IOT lower computer which you want to deploy this micro-service to, the mysql will be used as current micro-service's localDB to store and process operation data & logical data of current micro-service node.

2.接下来请在部署目标容器/虚拟机/IOT下位机中的mysql上运行repo中mysql localDB的初始化脚本。
2.Then, Please run the sql script under current github repo to init mysql localDB's structure on your deployment-target service container/virtual machine/ IOT lower computer .


3.如果你想在开发环境中调试本微服务，你可手动复制整个项目到测试使用的容器/虚拟机/IOT下位机中,同时根据你项目的实际情况配置src中的config文件，运行npm install初始化依赖模块后进入webApi目录并运行node diskDataEntry.js启动整个微服务。
   如果你想在生产环境中使用本微服务并且你拥有一个devops团队，你可将预部署的容器/虚拟机/IOT下位机 IP及端口配置到ansible的主机清单中，同时为src的config文件制作一个ansible jinjia2的模板并把常用配置参数配在ansible的var中，最后为你的部署目标服务器写一个playbook，在playbook最后的任务里进入webApi目录并运行node diskDataEntry.js启动整个微服务，最后把该部署动作整合到你jenkins的deployment pipeline中。
   如果你需要负载均衡以及更安全的内外网服务器分离，你可以将ansible主机清单中的终端IP配置给一台nginx服务作为集群的反向代理服务出口。
   假设你拥有一个主从复制的数据库集群，你希望将本微服务作为该数据库集群中主从节点的host shell对数据库进行读写操作。如果你要通过diskData host的是主数据节点，那么请将config文件中的runningMode设为master;如果你要通过diskData host的是从数据节点，那么请将config文件中的runningMode设为slave。
   如果你的数据库集群为mssql集群，那么请将config中reqStorageClusterType设为1;如果你的数据库集群为mysql集群，那么请将config中reqStorageClusterType设为0。
3.If you want to debug or try this micro-service on your dev environment,you can copy entire project to your deployment-target service container/virtual machine/ IOT lower computer，meanwhile config the config file under src folder per your actual project's requirements,then run 'npm install' to init node modules and go into webApi folder and run 'node diskDataEntry.js' to lauch the mirco-service.
   If you want to use this micro-service on your prod environment and you have a devops team,you can put your pre deploy service container/virtual machine/ IOT lower computer’s IP into ansible inventory host file, meanwhile prepare an ansible jinjia2 template for the config file under src and prepare its config-var under ansible var, then you can prepare a playbook to deploy it to your deployment-target services,at last task of the playbook you can go into webApi folder and run 'node diskDataEntry.js' to lauch the mirco-service.
   At last,you can integrate this deployment action into your Jenkins deployment pipeline.
   If you need load-balance and isolate interal and external network for your security, you can config the terminal IPs of your ansible inventory into a nginx service and let it be exit of your messageQueue cluster.
   Suppose you have a master-slave database cluster, and you want to let this micro-service be host shell for the master/slave database node under your database cluster. If your host target db node is master,please config runningMode as master under your config file;If your host target db node is slave,please config runningMode as slave under your config file;
   If your target host database cluster is created by mssql, please config 'reqStorageClusterType' to 1 under your config file;If your target host database cluster is created by mysql, please config 'reqStorageClusterType' to 0 under your config file.


4.如果你想调试这个微服务的整套restful API，可使用fiddler尝试运行如下报文。
4.If you want to debug this micro-service's restful API,you can use fiddler to run below post message to related API.

    ---- 读取数据库集群数据(read data from your database cluster slave node ) ----
	
	url:  http://127.0.0.1:8080/getDiskData
	User-Agent: Fiddler
	Host: 127.0.0.1
	Content-Length: 135
	content-type: application/json

	body message:
	{
	  
	  
	 "querySql":"select * from student"
	  
	}
	
	---- 写入数据库集群数据(write data to your database cluster master node ) ----
	
	如果你想使用数据库集群master节点写入功能，请结合本微服务平台框架下的memory repo一起使用。memory repo会向redis频道队列推送写操作的message，runningMode为master的diskData会订阅redis队列频道推送的写操作message并在diskData指向的master数据库节点上进行这个数据写操作。
	If you want to write data into your database cluster's master node, please use diskData repo together with memory repo under this micro-service platform. memory repo will push sql write operation message to redis queue channel, then the diskData whoes runningMode is master will subscribe the write operation message from the same redis queue channel and do it on the master database node which was pointed by this diskData micro-service.