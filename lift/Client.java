package lift;

import java.util.concurrent.*;

/**
 * 客户端类, 暴露可操作的接口
 * @author flowerwine
 * @date 2023 年 11 月 24 日
 */

public class Client {
    /**
     * 单例的 client
     */
    private static volatile Client client;

    private final Lift lift;
    private final ExecutorService executorService;

    private Client() {
        this.lift = Lift.singleInstance(10);
        this.executorService = new ThreadPoolExecutor(1, 2,
                0L, TimeUnit.MILLISECONDS,
                new LinkedBlockingQueue<>(1024), new ThreadPoolExecutor.AbortPolicy());
        this.run();
    }

    /**
     * 运行电梯, 执行主线程提交的任务, 持久运行
     */
    private void run() {
        this.executorService.execute(this.lift::run);
    }

    /**
     * 获取单例的客户端对象
     * @return 返回生成的客户端对象
     */
    public static Client singleInstance() {
        if(client == null) {
            synchronized (Client.class) {
                if(client == null) {
                    client = new Client();
                }
            }
        }
        return client;
    }

    /**
     * 请求上升, 如果电梯在经过该楼层时处于上升状态将会停下
     * @param layerNumber 层数
     */
    public void requestUp(int layerNumber) {
        this.lift.getLayer(layerNumber - 1).requestUpLift();
    }

    /**
     * 请求下降, 如果电梯在经过该楼层时处于下降状态将会停下
     * @param layerNumber 层数
     */
    public void requestDown(int layerNumber) {
        this.lift.getLayer(layerNumber - 1).requestDownLift();
    }
}
