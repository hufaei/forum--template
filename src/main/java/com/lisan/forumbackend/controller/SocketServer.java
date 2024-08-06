package com.lisan.forumbackend.controller;

import com.alibaba.fastjson.JSON;
import com.lisan.forumbackend.model.entity.Message;
import com.lisan.forumbackend.utils.ApplicationContextUtil;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

@ServerEndpoint(value = "/chat/{username}")
@Component
@Slf4j
public class SocketServer {


    // 保存链接的session，key为用户名,value为对应的session名
    private static ConcurrentHashMap<String, Session> sessionMap = new ConcurrentHashMap<>();

    /**
     * 创建连接
     * 用于监听建立连接，当有客户端与该服务端点建立连接时，将会自回调该注解标注的方法
     *
     * @param session
     * @param username
     */
    @OnOpen
    public void onOpen(Session session, @PathParam(value = "username") String username) {
        log.info("用户{}已创建连接", username);
        String key = "webSocket:" + username;
        sessionMap.put(username, session);
        //获取redis对象
        RedisTemplate redisTemplate = (RedisTemplate) ApplicationContextUtil.getBean("redis");
        //判断是否为空
        List<String> members = redisTemplate.opsForList().range(key, 0, -1);
        if (null != members && !members.isEmpty()) {
            for (String message : members) {
                Session toSession = sessionMap.get(username);
                //发送缓存信息
                sendMessage(toSession, message);
            }
            //删除redis中的键
            redisTemplate.delete(key);
        }
    }


    /**
     * 用于监听客户端向服务端发送消息，当客户端与服务端发送消息时，将会回调该注解标注的方法
     *
     * @param msg
     * @param username
     */
    @OnMessage
    public void onMessage(String msg, @PathParam(value = "username") String username) {
        log.info("用户{}发来消息:{}", username, msg);
        //解析用户发送的信息，使用系列化，映射到Message类
        Message message = JSON.parseObject(msg, Message.class);
        //使用工具类获取redis缓存数据库
        RedisTemplate redisTemplate = (RedisTemplate) ApplicationContextUtil.getBean("redis");
        //根据message中的to属性获取接收消息的用户的session，利用其session将消息转发过
        if (null == sessionMap.get(message.getTo())) {   //发送给的用户为空
            //存入redis
            redisTemplate.opsForList().rightPush("webSocket:" + message.getTo(), message.getMsg());
            return;
        }
        Session toSession = sessionMap.get(message.getTo());
        //发送信息给用户
        sendMessage(toSession, message.getMsg());
    }


    /**
     * 用于监听连接关闭，当客户端与该服务端点断开连接时，将会回调该注解标注的方法
     *
     * @param session
     * @param username
     */
    @OnClose
    public void onClose(Session session, @PathParam(value = "username") String username) {
        log.info("用户{}已关闭连接", username);
        sessionMap.remove(username);
    }


    /**
     * 用于监听该连接上的任何错误，当客户端与该服务端点的连接发生任何异常，都将回调该注解标注的方法
     * 注意该方法的参数必选Throwable，可选Sessiion以及0-n个String参数，且String参数需要使用@PathParam注解标注
     *
     * @param throwable
     * @param username
     */
    @OnError
    public void onError(Throwable throwable, @PathParam(value = "username") String username) {
        log.error(String.valueOf(throwable));
        log.error("用户{}连接发生异常", username);
    }


    /**
     * 用来发送消息的方法，参数分别为接收消息的用户的session，和对应的消息
     */
    private void sendMessage(Session toSession, String msg) {
        try {
            toSession.getBasicRemote().sendText(msg);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }


}